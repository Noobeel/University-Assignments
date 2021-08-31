from django.contrib import messages
from django.views.generic import DeleteView
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from .forms import UserRegisterForm, UserUpdateForm, ProfileUpdateForm
from .models import Profile

def register(request):
    if not request.user.is_authenticated:
        if request.method == 'POST':
            form = UserRegisterForm(request.POST)
            if form.is_valid():
                form.save()
                username = form.cleaned_data.get('username')
                messages.success(request, f'Account created for {username}!')
                return redirect('system-portal')
        else:
            form = UserRegisterForm()
        return render(request, 'users/register.html', {'form': form, 'title': 'Register'})
    else:
        return redirect('system-portal')

def lockout(request):
    return render(request, 'users/lockout.html', {'title': 'Locked Out'})
    
@login_required
def profile(request):
    if request.method == 'POST':
        user_form = UserUpdateForm(request.POST, instance=request.user)
        profile_form = ProfileUpdateForm(request.POST, request.FILES, instance=request.user.profile)
        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile_form.save()
            messages.success(request, f'Your profile info has been updated!')
            return redirect('profile')
    else:
        user_form = UserUpdateForm(instance=request.user)
        profile_form = ProfileUpdateForm(instance=request.user.profile)
    context = {
        'user_form': user_form,
        'profile_form': profile_form,
        'entry_id': Profile.objects.filter(user_id=request.user.id)[0].id,
        'title': 'Profile'
    }
    return render(request, 'users/profile.html', context)

class ProfileDeleteView(LoginRequiredMixin, DeleteView):
    model = Profile
    success_url = '/portal/'