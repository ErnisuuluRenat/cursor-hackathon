from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='trip',
            name='members',
            field=models.CharField(default='You', max_length=500),
        ),
    ]
