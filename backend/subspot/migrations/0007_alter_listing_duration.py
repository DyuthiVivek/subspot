# Generated by Django 5.1.1 on 2025-03-23 11:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subspot', '0006_subscription_renew_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='listing',
            name='duration',
            field=models.CharField(blank=True, default='', max_length=255),
        ),
    ]
