# pyrefly: ignore [missing-import]
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Player, Trip

MOCK_PLAN = {
    'packingList': ['Water', 'Sunscreen', 'Backpack'],
    'bestDay': 'Saturday',
    'steps': ['Meet at 10am', 'Head to location', 'Adventure time!'],
}

MOCK_VERDICT = {
    'verified': True,
    'reason': 'Looks like a great adventure!',
    'coolnessScore': 72,
}

ROOM = {
    'id': 'room-1',
    'members': [
        {'id': '1', 'name': 'You', 'avatar': '😎'},
        {'id': '2', 'name': 'Ali', 'avatar': '🧑'},
        {'id': '3', 'name': 'Masha', 'avatar': '👩'},
    ],
}

TRIP_STATUS_LABELS = {
    Trip.STATUS_PLANNING: 'In Planning',
    Trip.STATUS_PROOF_PENDING: 'Proof Pending',
    Trip.STATUS_COMPLETED: 'Completed',
}


def serialize_trip(trip):
    return {
        'id': trip.id,
        'name': trip.activity,
        'activity': trip.activity,
        'members': trip.members,
        'status': trip.status,
        'statusLabel': TRIP_STATUS_LABELS.get(trip.status, trip.status),
        'coolnessScore': trip.coolness_score,
        'createdAt': trip.created_at.isoformat(),
    }


def serialize_players():
    players = Player.objects.all().order_by('-elo')
    return [
        {
            'id': p.id,
            'name': p.name,
            'avatar': p.avatar,
            'elo': p.elo,
            'completedTrips': p.completed_trips,
        }
        for p in players
    ]


@api_view(['GET'])
def room(request):
    try:
        return Response({'room': ROOM})
    except Exception as err:
        print('room error:', err)
        return Response({'error': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def plan(request):
    try:
        activity = request.data.get('activity', '')
        members = request.data.get('members', [])

        try:
            from .planner import generate_plan
            plan_data = generate_plan(activity, members)
            return Response({'plan': plan_data})
        except Exception as err:
            print('plan error:', err)
            return Response({'plan': MOCK_PLAN})
    except Exception as err:
        print('plan error:', err)
        return Response({'error': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def verify(request):
    try:
        activity = request.data.get('activity', '')
        image = request.data.get('image', '')

        try:
            from .verifier import verify_proof
            verdict = verify_proof(activity, image)
            return Response({'verdict': verdict})
        except Exception as err:
            print('verify error:', err)
            return Response({'verdict': MOCK_VERDICT})
    except Exception as err:
        print('verify error:', err)
        return Response({'error': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def leaderboard(request):
    try:
        return Response({'players': serialize_players()})
    except Exception as err:
        print('leaderboard error:', err)
        return Response({'error': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def score(request):
    try:
        player_id = request.data.get('playerId')
        coolness_score = request.data.get('coolnessScore', 0)

        try:
            player = Player.objects.get(id=player_id)
        except Player.DoesNotExist:
            return Response({'error': 'Player not found'}, status=status.HTTP_404_NOT_FOUND)

        current_elo = player.elo
        try:
            from .elo import apply_result
            new_elo = apply_result(current_elo, coolness_score)
        except Exception as err:
            print('score error:', err)
            new_elo = current_elo + (coolness_score // 10) * 10

        player.elo = new_elo
        player.completed_trips += 1
        player.save()

        return Response({'players': serialize_players()})
    except Exception as err:
        print('score error:', err)
        return Response({'error': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'POST'])
def trips(request):
    try:
        if request.method == 'GET':
            trips_qs = Trip.objects.all().order_by('-created_at')
            return Response({'trips': [serialize_trip(t) for t in trips_qs]})

        activity = request.data.get('activity', '').strip()
        if not activity:
            return Response({'error': 'Activity is required'}, status=status.HTTP_400_BAD_REQUEST)

        members = request.data.get('members', 'You')
        trip_status = request.data.get('status', Trip.STATUS_PLANNING)
        if trip_status not in TRIP_STATUS_LABELS:
            trip_status = Trip.STATUS_PLANNING

        trip = Trip.objects.create(
            activity=activity,
            members=members,
            status=trip_status,
        )
        return Response({'trip': serialize_trip(trip)}, status=status.HTTP_201_CREATED)
    except Exception as err:
        print('trips error:', err)
        return Response({'error': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PATCH'])
def trip_detail(request, trip_id):
    try:
        try:
            trip = Trip.objects.get(id=trip_id)
        except Trip.DoesNotExist:
            return Response({'error': 'Trip not found'}, status=status.HTTP_404_NOT_FOUND)

        trip_status = request.data.get('status')
        if trip_status is not None:
            if trip_status in TRIP_STATUS_LABELS:
                trip.status = trip_status
            else:
                return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        coolness_score = request.data.get('coolnessScore')
        if coolness_score is not None:
            trip.coolness_score = coolness_score

        trip.save()
        return Response({'trip': serialize_trip(trip)})
    except Exception as err:
        print('trip_detail error:', err)
        return Response({'error': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def chat(request):
    try:
        messages = request.data.get('messages', [])

        try:
            import re
            from .ai import call_claude_chat
            from .planner import PLANNER_SYSTEM, extract_plan_from_message

            reply = call_claude_chat(messages, PLANNER_SYSTEM)
            plan_data = extract_plan_from_message(reply)

            # Strip the <PLAN>...</PLAN> block and PLAN_READY from the visible reply
            visible_reply = re.sub(r'<PLAN>[\s\S]*?<\/PLAN>', '', reply)
            visible_reply = visible_reply.replace('PLAN_READY', '').strip()

            return Response({'reply': visible_reply, 'plan': plan_data})
        except Exception as err:
            print('chat error:', err)
            # Fallback when key is missing or request fails
            return Response({
                'reply': "I'd love to help you plan that adventure! What works best for your group's availability?",
                'plan': None
            })
    except Exception as err:
        print('chat error:', err)
        return Response({'error': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
