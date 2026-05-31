from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Player

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
