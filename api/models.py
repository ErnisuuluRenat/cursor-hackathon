from django.db import models


class Player(models.Model):
    name = models.CharField(max_length=100)
    avatar = models.CharField(max_length=10)
    elo = models.FloatField(default=1200)
    completed_trips = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class Trip(models.Model):
    activity = models.CharField(max_length=200)
    status = models.CharField(max_length=20, default='planning')
    coolness_score = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.activity
