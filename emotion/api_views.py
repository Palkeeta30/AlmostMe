from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import EmotionResult

User = get_user_model()

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def detect_emotion(request):
    """
    Create a persisted EmotionResult only when persist=true is explicitly provided.
    Otherwise accept the request but do not store anything server-side.
    """
    user = request.user
    mood = request.data.get('mood', '')
    image = request.FILES.get('image', None)
    persist_value = str(request.data.get('persist', '')).lower().strip()
    persist = persist_value in ['true', '1', 'yes', 'y']

    if not mood and not image:
        return Response({'error': 'No mood or image provided'}, status=status.HTTP_400_BAD_REQUEST)

    if not persist:
        # Acknowledge without saving to disk or DB
        return Response({'status': 'ok', 'persisted': False}, status=status.HTTP_200_OK)

    # Persist explicitly
    emotion_result = EmotionResult(user=user, mood=mood)
    if image:
        emotion_result.image = image
    emotion_result.save()

    response_data = {
        'id': emotion_result.id,
        'mood': emotion_result.mood,
        'image_url': emotion_result.image.url if emotion_result.image else None,
        'confidence': emotion_result.confidence,
        'created_at': emotion_result.created_at,
        'persisted': True,
    }
    return Response(response_data, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_emotion_result(request, pk: int):
    """Delete a user's stored emotion result and its image file (if any)."""
    try:
        result = EmotionResult.objects.get(pk=pk, user=request.user)
    except EmotionResult.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    # Delete file from storage if present
    if result.image:
        result.image.delete(save=False)

    result.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
