from django.core.management.base import BaseCommand

from api.models import Player, Trip


PLAYERS = [
    {'name': 'You', 'avatar': '😎', 'elo': 1250, 'completed_trips': 1},
    {'name': 'John', 'avatar': '🧔', 'elo': 1400, 'completed_trips': 5},
    {'name': 'Sarah', 'avatar': '👱', 'elo': 1350, 'completed_trips': 4},
    {'name': 'Mike', 'avatar': '👨', 'elo': 1100, 'completed_trips': 2},
    {'name': 'Emma', 'avatar': '👧', 'elo': 950, 'completed_trips': 0},
]

TRIPS = [
    {
        'activity': 'Japan Exploration 🇯🇵',
        'members': 'Jordan, Riley, You',
        'status': Trip.STATUS_PLANNING,
    },
    {
        'activity': 'Sunset Beach volleyball 🏐',
        'members': 'Jordan, Alex, Sam',
        'status': Trip.STATUS_PROOF_PENDING,
    },
]


class Command(BaseCommand):
    help = 'Seed the database with initial players and trips'

    def handle(self, *args, **options):
        if not Player.objects.exists():
            for data in PLAYERS:
                Player.objects.create(**data)
            self.stdout.write(self.style.SUCCESS(f'Seeded {len(PLAYERS)} players.'))
        else:
            self.stdout.write('Players already exist, skipping player seed.')

        if not Trip.objects.exists():
            for data in TRIPS:
                Trip.objects.create(**data)
            self.stdout.write(self.style.SUCCESS(f'Seeded {len(TRIPS)} trips.'))
        else:
            self.stdout.write('Trips already exist, skipping trip seed.')
