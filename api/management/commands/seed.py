from django.core.management.base import BaseCommand

from api.models import Player


PLAYERS = [
    {'name': 'You', 'avatar': '😎', 'elo': 1250, 'completed_trips': 1},
    {'name': 'John', 'avatar': '🧔', 'elo': 1400, 'completed_trips': 5},
    {'name': 'Sarah', 'avatar': '👱', 'elo': 1350, 'completed_trips': 4},
    {'name': 'Mike', 'avatar': '👨', 'elo': 1100, 'completed_trips': 2},
    {'name': 'Emma', 'avatar': '👧', 'elo': 950, 'completed_trips': 0},
]


class Command(BaseCommand):
    help = 'Seed the database with initial players'

    def handle(self, *args, **options):
        if Player.objects.exists():
            self.stdout.write('Players already exist, skipping seed.')
            return

        for data in PLAYERS:
            Player.objects.create(**data)

        self.stdout.write(self.style.SUCCESS(f'Seeded {len(PLAYERS)} players.'))
