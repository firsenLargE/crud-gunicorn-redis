from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from .views import TaskViewSet, RegisterView

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),
    path('signup/', RegisterView.as_view(), name='signup'),
    path('login/', obtain_auth_token, name='login'),
]
