from django.urls import path
from .views import dashboard_views, marketpage_views
from .views import auth

urlpatterns = [
    path("auth/login/", auth.Login.as_view(), name="Login"),
    path("auth/logout/", auth.Logout.as_view(), name="Logout"),
    path("auth/signup/", auth.SignUp.as_view(), name="Signup"),
    path("", dashboard_views.home, name="home"),
    path("subscriptions/", dashboard_views.SubscriptionsView.as_view(), name="subscriptions"),
    path('subscriptions/<int:subscription_id>/', dashboard_views.SubscriptionsView.as_view(), name='subscription_detail'),
    path("expenses/", dashboard_views.UserExpensesView.as_view(), name="expenses"),
    path("reminders/", dashboard_views.SubscriptionRemindersView.as_view(), name="reminders"),
    path("listings/", marketpage_views.AvailableListingsView.as_view(), name="listings"),
    path("unsold-listings/", marketpage_views.UserUnSoldListingsView.as_view(), name="unsold_listings"),

]