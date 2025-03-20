from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    name = models.CharField(max_length=100,blank=True)
    phone_no = models.CharField(max_length=15,blank=True)
    age = models.IntegerField(blank=True)

    def  __str__(self):
        return str(self.id) + self.name   

class Subscription(models.Model):
    class BillingCycle(models.TextChoices):
        MONTHLY = 'monthly', 'Monthly'
        QUARTERLY = 'quarterly', 'Quarterly'
        YEARLY = 'yearly', 'Yearly'
    
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="subscriptions")
    service_name = models.CharField(max_length=255)
    billing_cycle = models.CharField(max_length=50, choices=BillingCycle.choices, default=BillingCycle.MONTHLY) 
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateField()
    is_shareable = models.BooleanField(default=True)
    is_autorenew = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.service_name} ({self.owner.username})"

class Listing(models.Model):
    subscription = models.OneToOneField(Subscription, on_delete=models.CASCADE, related_name="listings")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_sold = models.BooleanField(default=False)

    def __str__(self):
        return f"Listing for {self.subscription.service_name} - {'Sold' if self.is_sold else 'Available'}"

class FriendConnection(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="friends")
    friend = models.ForeignKey(User, on_delete=models.CASCADE, related_name="friendships")
    status = models.CharField(max_length=50, choices=[("pending", "Pending"), ("accepted", "Accepted"), ("rejected", "Rejected")], default="pending")

    class Meta:
        unique_together = ('user', 'friend')  

    def __str__(self):
        return f"{self.user.username} has friended {self.friend.username} ({self.status})"
    

class MonthlyExpense(models.Model):
    class Month(models.TextChoices):
        JANUARY = 'January', 'January'
        FEBRUARY = 'February', 'February'
        MARCH = 'March', 'March'
        APRIL = 'April', 'April'
        MAY = 'May', 'May'
        JUNE = 'June', 'June'
        JULY = 'July', 'July'
        AUGUST = 'August', 'August'
        SEPTEMBER = 'September', 'September'
        OCTOBER = 'October', 'October'
        NOVEMBER = 'November', 'November'
        DECEMBER = 'December', 'December'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="monthly_expenses")
    month_name = models.CharField(max_length=20, choices=Month.choices)
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ('user', 'month_name')

    def __str__(self):
        return f"{self.user.username} - {self.month_name}: ${self.amount}"

