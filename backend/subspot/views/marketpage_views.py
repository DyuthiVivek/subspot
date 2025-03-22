from django.http import JsonResponse
from django.views import View
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from ..models import Listing, Subscription
from django.contrib.auth.mixins import LoginRequiredMixin

class AvailableListingsView(View):
    def get(self, request):
        available_listings = Listing.objects.filter(is_sold=False).select_related('subscription')
        listings_data = []

        for listing in available_listings:
            subscription = listing.subscription
            end_date = subscription.start_date

            if subscription.billing_cycle == Subscription.BillingCycle.MONTHLY:
                end_date += relativedelta(months=1)
            elif subscription.billing_cycle == Subscription.BillingCycle.QUARTERLY:
                end_date += relativedelta(months=3)
            elif subscription.billing_cycle == Subscription.BillingCycle.YEARLY:
                end_date += relativedelta(years=1)

            delta = relativedelta(end_date, timezone.now().date())
            duration_parts = []
            if delta.years > 0:
                duration_parts.append(f"{delta.years} years")
            if delta.months > 0:
                duration_parts.append(f"{delta.months} months")
            if delta.days > 0:
                duration_parts.append(f"{delta.days} days")
            listing.duration = " ".join(duration_parts)

            if delta.years <= 0 and delta.months <= 0 and delta.days <= 0:
                listing.duration = "Expired"
            else:
                listings_data.append({
                    'id': listing.id,
                    'seller_id': subscription.owner.id,
                    'price': listing.price,
                    'name': subscription.service_name,
                    'duration': listing.duration,
                    'is_sold': listing.is_sold,
                    'logo': f"https://logo.clearbit.com/{subscription.service_name.split()[0].lower()}.com"
                })

        return JsonResponse(listings_data, safe=False)
    

class UserUnSoldListingsView(LoginRequiredMixin, View):
    def get(self, request):
        user = request.user
        user_listings = Listing.objects.filter(subscription__owner=user, is_sold=False).select_related('subscription')
        listings_data = []

        for listing in user_listings:
            subscription = listing.subscription
            end_date = subscription.start_date

            if subscription.billing_cycle == Subscription.BillingCycle.MONTHLY:
                end_date += relativedelta(months=1)
            elif subscription.billing_cycle == Subscription.BillingCycle.QUARTERLY:
                end_date += relativedelta(months=3)
            elif subscription.billing_cycle == Subscription.BillingCycle.YEARLY:
                end_date += relativedelta(years=1)

            delta = relativedelta(end_date, timezone.now().date())
            duration_parts = []
            if delta.years > 0:
                duration_parts.append(f"{delta.years} years")
            if delta.months > 0:
                duration_parts.append(f"{delta.months} months")
            if delta.days > 0:
                duration_parts.append(f"{delta.days} days")
            duration = " ".join(duration_parts)

            if delta.years <= 0 and delta.months <= 0 and delta.days <= 0:
                duration = "Expired"
            else:
                listings_data.append({
                    'id': listing.id,
                    'seller_id': subscription.owner.id,
                    'price': listing.price,
                    'name': subscription.service_name,
                    'duration': duration,
                    'is_sold': listing.is_sold,
                    'logo': f"https://logo.clearbit.com/{subscription.service_name.split()[0].lower()}.com"
                })

        return JsonResponse(listings_data, safe=False)