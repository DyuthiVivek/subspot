from django.contrib import admin
from .models import User, Subscription, Listing, FriendConnection, MonthlyExpense

admin.site.register(User)
admin.site.register(Subscription)
admin.site.register(Listing)
admin.site.register(FriendConnection)
admin.site.register(MonthlyExpense)



# Register your models here.
