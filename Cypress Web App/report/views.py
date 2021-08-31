from django.contrib import messages
from django.core.mail import send_mail
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import ListView, UpdateView, DeleteView
from .forms import ReportForm
from .models import Report

@login_required
def report(request):
    if request.method == 'POST':
        form = ReportForm(request.POST)
        form.fields['Creation_Date_and_Time'].disabled = True
        if form.is_valid():
            report = form.save(commit=False)
            report.reporter = request.user
            report.save()
            messages.success(request, f'Your report has been created!')
            return redirect('system-portal')
    else:
        form = ReportForm()
        form.fields['Creation_Date_and_Time'].disabled = True
    return render(request, 'report/report_problem.html', {'form': form, 'title': 'Create Report'})

@login_required
def report_update(request):
    user_reports = request.user.report_set.all().order_by('completed')
    return render(request, 'report/report_update.html', {'reports': user_reports, 'title': 'Update Report'})

@login_required
def report_like(request):
    report = get_object_or_404(Report, id=request.POST.get('report_id'))
    report.likes.add(request.user)
    return redirect('report-suggest')

@login_required
def report_complete(request):
    report = get_object_or_404(Report, id=request.POST.get('report_id'))
    report.completed = True
    report.save()
    if report.notifications:
        message = 'This e-mail is to inform you that your report created on {}, which was submitted to City of Toronto\'s Cypress system has been successfully completed and the issue has been resolved.\nThank you for helping keep the city streets clean and safe.\n\nWith Regards,\nCity Of Toronto Cypress Team'.format(report.Creation_Date_and_Time)
        send_mail(
            'Cypress Report#{0} by User: {1}'.format(report.id, report.reporter.username),
            message,
            'cypress.cps406@gmail.com',
            [report.reporter.email],
            fail_silently=False,
        )
    return redirect('report-suggest')

class ReportSuggestView(LoginRequiredMixin, ListView):
    template_name = 'report/report_suggest.html'
    queryset = Report.objects.all().order_by('completed')
    context_object_name = 'reports'

class ReportEditView(LoginRequiredMixin, UpdateView):
    model = Report
    template_name = 'report/report_problem.html'
    fields = ['address', 'problem', 'notifications']

    def form_valid(self, form):
        form.instance.reporter = self.request.user
        return super().form_valid(form)

class ReportDeleteView(LoginRequiredMixin, DeleteView):
    model = Report
    success_url = '/report-update/'
