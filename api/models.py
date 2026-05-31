from django.db import models


class Player(models.Model):
    name = models.CharField(max_length=100)
    avatar = models.CharField(max_length=10)
    elo = models.FloatField(default=1200)
    completed_trips = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class Trip(models.Model):
    STATUS_PLANNING = 'planning'
    STATUS_PROOF_PENDING = 'proof_pending'
    STATUS_COMPLETED = 'completed'

    activity = models.CharField(max_length=200)
    members = models.CharField(max_length=500, default='You')
    status = models.CharField(max_length=20, default=STATUS_PLANNING)
    coolness_score = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.activity
