from django.http import JsonResponse
from django.views import View
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from ..models import Listing, Subscription

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
            if delta.years:
                duration_parts.append(f"{delta.years} years")
            if delta.months:
                duration_parts.append(f"{delta.months} months")
            if delta.days:
                duration_parts.append(f"{delta.days} days")
            duration = " ".join(duration_parts)

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