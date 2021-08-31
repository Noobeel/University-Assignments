from django.urls import path
from . import views

urlpatterns = [
    path('', views.main, name='system-main'),
    path('portal/', views.portal, name='system-portal'),
    path('contact/', views.contact, name='system-contact'),
    path('faq/', views.faq, name='system-faq')
]