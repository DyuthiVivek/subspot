from rest_framework import serializers
from .models import User, Subscription, Listing, FriendConnection, MonthlyExpense

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class SubscriptionSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)  

    class Meta:
        model = Subscription
        fields = '__all__'

class ListingSerializer(serializers.ModelSerializer):
    subscription = SubscriptionSerializer(read_only=True)  

    class Meta:
        model = Listing
        fields = '__all__'

class FriendConnectionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    friend = UserSerializer(read_only=True)

    class Meta:
        model = FriendConnection
        fields = '__all__'

class MonthlyExpenseSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = MonthlyExpense
        fields = '__all__'
