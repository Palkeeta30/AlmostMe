from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

def diet(request):
    return render(request, 'diet/index.html')

@csrf_exempt
def meal_plan(request):
    if request.method == 'GET':
        # Return empty meal plan for now
        return JsonResponse({
            'success': True,
            'meal_plan': {
                'breakfast': [],
                'lunch': [],
                'dinner': [],
                'snacks': []
            }
        })
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            # Save meal plan logic here
            return JsonResponse({
                'success': True,
                'message': 'Meal plan saved successfully'
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': str(e)
            }, status=400)

    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)
