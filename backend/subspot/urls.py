from django.urls import path
from . import views
from . import auth

urlpatterns = [
    path("auth/login/", auth.Login.as_view(), name="Login"),
    path("auth/logout/", auth.Logout.as_view(), name="Logout"),
    path("auth/signup/", auth.SignUp.as_view(), name="Signup"),
    path("", views.home, name="home"),
    path("subscriptions/", views.SubscriptionsView.as_view(), name="subscriptions"),
    path("subscriptions/<int:subscription_id>/", views.SubscriptionsView.as_view(), name="subscription_detail"),
    path("expenses/", views.UserExpensesView.as_view(), name="expenses"),
    path("reminders/", views.SubscriptionRemindersView.as_view(), name="reminders"),

]