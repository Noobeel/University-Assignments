from django.db import models
from django.utils import timezone
from django.urls import reverse
from django.contrib.auth.models import User

class Report(models.Model):
    problem_options = [
        ('utility_failure', 'Utility Failure'),
        ('tree_collapse', 'Tree Collapse'),
        ('potholes', 'Potholes'),
        ('flooded_streets', 'Flooded Streets'),
        ('vandalism', 'City Property Vandalism'),
        ('mould_spore', 'Mould and Spore Growth'),
        ('eroded_street', 'Eroded Street'),
        ('blocking_objects', 'Garbage or any Other Road Blocking Objects')
    ]
    notification_choices = (
        (True, 'Yes'),
        (False, 'No')
    )

    address = models.CharField(max_length=100)
    problem = models.CharField(max_length=100, choices=problem_options)
    reporter = models.ForeignKey(User, on_delete=models.CASCADE) # One-to-many relationship from User to Report
    Creation_Date_and_Time = models.DateTimeField(default=timezone.now)
    notifications = models.BooleanField(choices = notification_choices, default=False, verbose_name='Subscribe to Completion Notification')
    completed = models.BooleanField(default=False)
    likes = models.ManyToManyField(User, related_name='liked_reports')

    def __str__(self):
        return f'Report by {self.reporter.username}'

    def get_absolute_url(self):
        return reverse('report-update')

    @property
    def count_likes(self):
        return self.likes.count()
