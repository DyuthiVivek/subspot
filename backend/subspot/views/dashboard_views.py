from django.http import HttpResponse, JsonResponse
from django.views import View
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json

from ..models import Subscription, MonthlyExpense, User

def home(request):
    return HttpResponse("Welcome to the Homepage!")

# views for dashboard page

@method_decorator(csrf_exempt, name='dispatch')
class SubscriptionsView(View):
    def get(self, request):
        # get all subscriptions for the authenticated user

        user = request.user
        subscriptions = list(Subscription.objects.filter(owner=user.id).values())
        
        for sub in subscriptions:
            sub['amount'] = float(sub['amount'])
            # add default logo for now
            sub['logo'] = f"https://logo.clearbit.com/{sub['service_name'].split()[0].lower()}.com"
            # renaming to match frontend
            sub['name'] = sub.pop('service_name')
            sub['cost'] = str(sub.pop('amount'))
            
        return JsonResponse(subscriptions, safe=False)
    
    def post(self, request):
        # create a new subscription

        try:
            data = json.loads(request.body)
            billing_cycle = data.get('reminder', Subscription.BillingCycle.MONTHLY)
            if billing_cycle not in dict(Subscription.BillingCycle.choices):
                billing_cycle = Subscription.BillingCycle.MONTHLY

            new_subscription = Subscription(
                owner=request.user,
                service_name=data.get('name'),
                billing_cycle=billing_cycle,
                amount=data.get('cost'),
                start_date=timezone.now().date(),
                is_shareable=data.get('is_shareable', True),
                is_autorenew=data.get('is_autorenew', False)
            )
            new_subscription.save()
            
            return JsonResponse({
                'id': new_subscription.id,
                'name': new_subscription.service_name,
                'cost': str(new_subscription.amount),
                'logo': f"https://logo.clearbit.com/{new_subscription.service_name.split()[0].lower()}.com",
            }, status=201)
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    def delete(self, request, subscription_id):
        # delete a subscription
        try:
            subscription = Subscription.objects.get(id=subscription_id, owner=request.user)
            subscription.delete()
            return JsonResponse({'success': True}, status=200)
        except Subscription.DoesNotExist:
            return JsonResponse({'error': 'Subscription not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

class UserExpensesView(View):
    def get(self, request):
        # get expenses data for the last 12 months

        user = request.user
        today = timezone.now().date()
        current_month = today.month
        current_year = today.year
        months = 12
        
        expenses_data = []
        months_list = []
        bar_heights = []
        
        for i in range(months):
            month_date = today - relativedelta(months=months-i-1)
            month_name = month_date.strftime('%B')
            months_list.append(month_name)
            
            # check if already calculated
            month_expense = MonthlyExpense.objects.filter(
                user=user, 
                month_name=month_name
            ).first()
            
            if month_expense:
                amount = float(month_expense.amount)
            else:
                # calculate from subscriptions active in this month
                nxt_month_start = (month_date + relativedelta(months=1)).replace(day=1)
                
                active_subs = Subscription.objects.filter(
                    owner=user,
                    start_date__lt=nxt_month_start
                )
                
                # add all subscription amounts
                amount = sum(float(sub.amount) for sub in active_subs)
                
                # save for future use if month finished
                if month_date.month != current_month or month_date.year != current_year:
                    MonthlyExpense.objects.create(
                        user=user,
                        month_name=month_name,
                        amount=amount
                    )
            
            bar_heights.append(amount)
            
            expenses_data.append({
                'month': month_name,
                'amount': amount
            })
        
        return JsonResponse({
            'expenses': expenses_data,
            'months': months_list,
            'barHeights': bar_heights,
        })

@method_decorator(csrf_exempt, name='dispatch')
class SubscriptionRemindersView(View):
    def get(self, request):
        # get subscriptions that need reminders

        user = request.user
        today = timezone.now().date()
        
        # reminder only if not autorenewable
        subscriptions = Subscription.objects.filter(
            owner=user,
            is_autorenew=False
        )
        
        reminders = []
        
        for sub in subscriptions:
            # calculate end date based on billing cycle
            start_date = sub.start_date
            billing_cycle = sub.billing_cycle
            

            if billing_cycle == Subscription.BillingCycle.MONTHLY:
                end_date = start_date + relativedelta(months=1)

            elif billing_cycle == Subscription.BillingCycle.QUARTERLY:
                end_date = start_date + relativedelta(months=3)

            elif billing_cycle == Subscription.BillingCycle.YEARLY:
                end_date = start_date + relativedelta(years=1)

            else:
                end_date = start_date + relativedelta(months=1)



            # reminder given if subscription ends in less than 4 days
            days_remaining = (end_date - today).days
            if days_remaining < 4:
                reminders.append({
                    'id': sub.id,
                    'name': sub.service_name,
                    'cost': str(float(sub.amount)),
                    'date': end_date.strftime('%b %d')
                })
        
        return JsonResponse(reminders, safe=False)
    
