# Generated by Django 5.1.1 on 2025-03-23 10:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subspot', '0005_listing_duration'),
    ]

    operations = [
        migrations.AddField(
            model_name='subscription',
            name='renew_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]
