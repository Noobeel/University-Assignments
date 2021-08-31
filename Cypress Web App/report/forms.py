from django import forms
from .models import Report

class ReportForm(forms.ModelForm):
    
    class Meta:
        model = Report
        exclude = ['reporter', 'completed', 'likes']

    def __init__(self, *args, **kwargs):
        super(ReportForm, self).__init__(*args, **kwargs)
        input_attrs = {
            'id': 'problem-address',
            'name': 'problem-address',
            'autocomplete': 'on'
        }
        self.fields['address'].widget = forms.TextInput(attrs=input_attrs)
