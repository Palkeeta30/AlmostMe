from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.middleware.csrf import get_token as get_csrf_token
import json

@ensure_csrf_cookie
def api_csrf(request):
    return JsonResponse({'success': True, 'message': 'CSRF cookie set'})

@csrf_exempt
def api_login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")
            remember_me = data.get("remember_me", False)
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)

                # Set different session durations based on remember_me preference
                if remember_me:
                    # 30 days for "Remember Me"
                    request.session.set_expiry(30 * 24 * 60 * 60)  # 30 days in seconds
                else:
                    # 24 hours for regular login
                    request.session.set_expiry(24 * 60 * 60)  # 24 hours in seconds

                return JsonResponse({"success": True, "message": "Logged in successfully"})
            else:
                return JsonResponse({"success": False, "message": "Invalid credentials"}, status=401)
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=400)
    return JsonResponse({"success": False, "message": "Invalid method"}, status=405)

@csrf_exempt
def api_signup(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            email = data.get("email")
            password = data.get("password")
            if not username or not email or not password:
                return JsonResponse({"success": False, "message": "Username, email, and password are required"}, status=400)
            if User.objects.filter(username=username).exists():
                return JsonResponse({"success": False, "message": "Username already exists"}, status=400)
            if User.objects.filter(email=email).exists():
                return JsonResponse({"success": False, "message": "Email already exists"}, status=400)
            user = User.objects.create_user(username=username, email=email, password=password)
            user.save()
            login(request, user)
            return JsonResponse({"success": True, "message": "User created and logged in"})
        except Exception as e:
            import traceback
            traceback.print_exc()
            return JsonResponse({"success": False, "message": str(e)}, status=400)
    return JsonResponse({"success": False, "message": "Invalid method"}, status=405)

@csrf_exempt
def api_logout(request):
    if request.method == "POST":
        logout(request)
        return JsonResponse({"success": True, "message": "Logged out successfully"})
    return JsonResponse({"success": False, "message": "Invalid method"}, status=405)

def api_current_user(request):
    if request.user.is_authenticated:
        return JsonResponse({
            "success": True,
            "username": request.user.username,
            "email": request.user.email,
        })
    else:
        return JsonResponse({"success": False, "message": "User not authenticated"}, status=401)

@csrf_exempt
def api_refresh_session(request):
    """Refresh user session to extend login duration"""
    if request.method == "POST":
        if request.user.is_authenticated:
            # Update the session to extend its life
            request.session.modified = True
            return JsonResponse({
                "success": True,
                "message": "Session refreshed successfully",
                "username": request.user.username,
                "email": request.user.email,
            })
        else:
            return JsonResponse({"success": False, "message": "User not authenticated"}, status=401)
    return JsonResponse({"success": False, "message": "Invalid method"}, status=405)

@csrf_exempt
def api_update_profile(request):
    if not request.user.is_authenticated:
        return JsonResponse({"success": False, "message": "User not authenticated"}, status=401)

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user = request.user

            # Update user fields
            if 'username' in data and data['username']:
                if User.objects.filter(username=data['username']).exclude(id=user.id).exists():
                    return JsonResponse({"success": False, "message": "Username already exists"}, status=400)
                user.username = data['username']

            if 'email' in data and data['email']:
                if User.objects.filter(email=data['email']).exclude(id=user.id).exists():
                    return JsonResponse({"success": False, "message": "Email already exists"}, status=400)
                user.email = data['email']

            user.save()

            return JsonResponse({
                "success": True,
                "message": "Profile updated successfully",
                "user": {
                    "username": user.username,
                    "email": user.email,
                }
            })
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=400)

    return JsonResponse({"success": False, "message": "Invalid method"}, status=405)

@csrf_exempt
def api_delete_account(request):
    if not request.user.is_authenticated:
        return JsonResponse({"success": False, "message": "User not authenticated"}, status=401)

    if request.method == "POST":
        try:
            user = request.user
            logout(request)
            user.delete()
            return JsonResponse({"success": True, "message": "Account deleted successfully"})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=400)

    return JsonResponse({"success": False, "message": "Invalid method"}, status=405)

@csrf_exempt
def api_change_password(request):
    if not request.user.is_authenticated:
        return JsonResponse({"success": False, "message": "User not authenticated"}, status=401)

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user = request.user

            current_password = data.get("current_password")
            new_password = data.get("new_password")

            if not current_password or not new_password:
                return JsonResponse({"success": False, "message": "Current password and new password are required"}, status=400)

            # Verify current password
            if not user.check_password(current_password):
                return JsonResponse({"success": False, "message": "Current password is incorrect"}, status=400)

            # Set new password
            user.set_password(new_password)
            user.save()

            return JsonResponse({"success": True, "message": "Password changed successfully"})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=400)

    return JsonResponse({"success": False, "message": "Invalid method"}, status=405)
