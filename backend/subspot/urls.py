from django.urls import path
from .views import dashboard_views, marketpage_views
from .views import auth
from .views import ml_prediction_views


urlpatterns = [
    path("auth/login/", auth.Login.as_view(), name="Login"),
    path("auth/logout/", auth.Logout.as_view(), name="Logout"),
    path("auth/signup/", auth.SignUp.as_view(), name="Signup"),
    path("auth/user/", auth.UserInfo.as_view(), name="UserInfo"),
    path("", dashboard_views.home, name="home"),
    path("subscriptions/", dashboard_views.SubscriptionsView.as_view(), name="subscriptions"),
    path('subscriptions/<int:subscription_id>/', dashboard_views.SubscriptionsView.as_view(), name='subscription_detail'),
    path("expenses/", dashboard_views.UserExpensesView.as_view(), name="expenses"),
    path("reminders/", dashboard_views.SubscriptionRemindersView.as_view(), name="reminders"),
    path("listings/", marketpage_views.AvailableListingsView.as_view(), name="listings"),
    path("unsold-listings/", marketpage_views.UserUnSoldListingsView.as_view(), name="unsold_listings"),
    path("mark-sold/", marketpage_views.MarkSoldView.as_view(), name="mark_sold"),
    path("sold-listings/", marketpage_views.UserSoldListingsView.as_view(), name="sold_listings"),
    path("prediction/", ml_prediction_views.PredictionView.as_view(), name="prediction"),
    path("mark-paid/", dashboard_views.MarkReminderDoneView.as_view(), name="mark_paid"),
    path("edit-listing-price/", marketpage_views.EditListingPrice.as_view(), name="edit_listing_price"),
    path("unsold-expired-listings/", marketpage_views.UserUnSoldExpiredListingsView.as_view(), name="unsold_expired_listings"),
    # path('auth/csrf/', auth.get_csrf_token, name='csrf_token'),

]