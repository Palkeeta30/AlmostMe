from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import JsonResponse
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.conf import settings
import json
from .forms import ContactForm
from .models import ContactMessage

def contact(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Your message has been sent successfully! We will get back to you soon.')
            return redirect('contact')
    else:
        form = ContactForm()

    return render(request, 'contact/index.html', {'form': form})

@csrf_exempt
@require_POST
def contact_api_send(request):
    try:
        data = json.loads(request.body)
        name = data.get('name')
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')

        if not all([name, email, subject, message]):
            return JsonResponse({'message': 'All fields are required.'}, status=400)

        # Save to database
        contact_message = ContactMessage.objects.create(
            name=name,
            email=email,
            subject=subject,
            message=message
        )

        # Send email (skip in test mode or if credentials are not configured)
        if not getattr(settings, 'TESTING', False) and settings.EMAIL_HOST_PASSWORD != 'your_gmail_app_password_here':
            try:
                email_subject = f"Contact Form: {subject}"
                email_message = f"""
New contact form submission:

Name: {name}
Email: {email}
Subject: {subject}

Message:
{message}
"""
                send_mail(
                    email_subject,
                    email_message,
                    'talkto.almostme@gmail.com',  # From email
                    ['talkto.almostme@gmail.com'],  # To email
                    fail_silently=False,
                )
            except Exception as e:
                # Log the error but don't fail the request
                import logging
                logger = logging.getLogger(__name__)
                logger.warning(f"Failed to send contact email: {e}")

        return JsonResponse({'message': 'Message sent successfully!'}, status=200)

    except json.JSONDecodeError:
        return JsonResponse({'message': 'Invalid JSON data.'}, status=400)
    except Exception as e:
        return JsonResponse({'message': f'Error sending message: {str(e)}'}, status=500)
