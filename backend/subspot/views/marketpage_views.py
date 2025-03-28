import json
from django.http import JsonResponse
from django.views import View
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from ..models import Listing, Subscription
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

@method_decorator(csrf_exempt, name='dispatch')
class AvailableListingsView(View):
    def get(self, request):
        available_listings = Listing.objects.filter(is_sold=False).select_related('subscription')
        listings_data = []

        for listing in available_listings:
            subscription = listing.subscription

            delta = relativedelta(subscription.renew_date, timezone.now().date())
            if(listing.duration != "Expired"):
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
            listing.save()

        return JsonResponse(listings_data, safe=False)
    
    
    def post(self, request):
        data = request.POST
        subscription_id = data.get('subscription_id')
        price = data.get('price')
        isSold = data.get('is_sold', False)
        
        subscription = Subscription.objects.filter(id=subscription_id).first()
        if subscription:
            if Listing.objects.filter(subscription=subscription).exists():
                return JsonResponse({'message': 'Listing already exists for this subscription!'}, status=400)
            listing = Listing.objects.create(subscription=subscription, price=price, is_sold=isSold)
            return JsonResponse({'message': 'Listing created successfully!', 'listing_id': listing.id})
        else:
            return JsonResponse({'message': 'Subscription not found!'}, status=404)


    def delete(self, request):
        data = json.loads(request.body)
        listing_id = data.get('listing_id')


        listing = Listing.objects.filter(id=listing_id).first()
        if listing:
            listing.delete()
            return JsonResponse({'message': 'Listing deleted successfully!'})
        else:
            return JsonResponse({'message': 'Listing not found!'}, status=404)
    

class UserUnSoldListingsView(LoginRequiredMixin, View):
    def get(self, request):
        user = request.user
        user_listings = Listing.objects.filter(subscription__owner=user, is_sold=False).select_related('subscription')
        listings_data = []

        for listing in user_listings:
            subscription = listing.subscription
            delta = relativedelta(subscription.renew_date, timezone.now().date())
            if(listing.duration != "Expired"):
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

            listing.save()

        return JsonResponse(listings_data, safe=False)
    
class UserUnSoldExpiredListingsView(LoginRequiredMixin, View):
    def get(self, request):
        user = request.user
        user_listings = Listing.objects.filter(subscription__owner=user, is_sold=False).select_related('subscription')
        listings_data = []

        for listing in user_listings:
            subscription = listing.subscription
            delta = relativedelta(subscription.renew_date, timezone.now().date())
            if(listing.duration != "Expired"):
                duration_parts = []
                if delta.years > 0:
                    duration_parts.append(f"{delta.years} years")
                if delta.months > 0:
                    duration_parts.append(f"{delta.months} months")
                if delta.days > 0:
                    duration_parts.append(f"{delta.days} days")
                listing.duration = " ".join(duration_parts)

            if listing.duration == "Expired" or (delta.years <= 0 and delta.months <= 0 and delta.days <= 0):
                listing.duration = "Expired"
                listings_data.append({
                    'id': listing.id,
                    'seller_id': subscription.owner.id,
                    'price': listing.price,
                    'name': subscription.service_name,
                    'duration': listing.duration,
                    'is_sold': listing.is_sold,
                    'logo': f"https://logo.clearbit.com/{subscription.service_name.split()[0].lower()}.com"
                })

            listing.save()

        return JsonResponse(listings_data, safe=False)
    
@method_decorator(csrf_exempt, name='dispatch')
class MarkSoldView(LoginRequiredMixin, View):
    def post(self, request):
        user = request.user
        listing = Listing.objects.filter(id= request.POST.get('listing_id'), subscription__owner=user).first()

        if listing:
            listing.is_sold = True
            listing.save()
            return JsonResponse({'message': 'Listing marked as sold!'})
        else:
            return JsonResponse({'message': 'Listing not found!'}, status=404)


class UserSoldListingsView(LoginRequiredMixin, View):
    def get(self, request):
        user = request.user
        user_listings = Listing.objects.filter(subscription__owner=user, is_sold=True).select_related('subscription')
        listings_data = []

        for listing in user_listings:
            subscription = listing.subscription
            
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
    
@method_decorator(csrf_exempt, name='dispatch')
class EditListingPrice(LoginRequiredMixin, View):
    def post(self, request):
        data = request.POST
        listing_id = data.get('listing_id')
        new_price = data.get('new_price')

        listing = Listing.objects.filter(id=listing_id, subscription__owner=request.user).first()
        if listing:
            listing.price = new_price
            listing.save()
            return JsonResponse({'message': 'Price updated successfully!'})
        else:
            return JsonResponse({'message': 'Listing not found!'}, status=404)