"""CypressWebsite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views
from users import views as user_views # App/Folder users
from report import views as report_views # App/Folder report

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('system.urls')),
    path('register/', user_views.register, name = 'register'),
    path('captcha/', include('captcha.urls')), 
    path('profile/', user_views.profile, name = 'profile'),
    path('profile-delete/<int:pk>/', user_views.ProfileDeleteView.as_view(), name = 'profile-delete'),
    path('login/', auth_views.LoginView.as_view(template_name = 'users/login.html'), name = 'login'),
    path('logout/', auth_views.LogoutView.as_view(template_name = 'users/logout.html'), name = 'logout'),
    path('lockout/', user_views.lockout, name = 'lockout'),
    path('report/', report_views.report, name = 'report'),
    path('report-update/', report_views.report_update, name = 'report-update'),
    path('report-edit/<int:pk>/', report_views.ReportEditView.as_view(), name = 'report-edit'),
    path('report-delete/<int:pk>/', report_views.ReportDeleteView.as_view(), name = 'report-delete'),
    path('report-suggest/', report_views.ReportSuggestView.as_view(), name = 'report-suggest'),
    path('report-like/', report_views.report_like, name = 'report-like'),
    path('report-complete/', report_views.report_complete, name = 'report-complete'),
    path('password-reset/', auth_views.PasswordResetView.as_view(template_name='users/password_reset.html'), name='password_reset'),
    path('password-reset/done/', auth_views.PasswordResetDoneView.as_view(template_name='users/password_reset_done.html'), name='password_reset_done'),
    path('password-reset-confirm/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(template_name='users/password_reset_confirm.html'), name='password_reset_confirm'),
    path('password-reset-complete/', auth_views.PasswordResetCompleteView.as_view(template_name='users/password_reset_complete.html'), name='password_reset_complete'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
