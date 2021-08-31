from django.shortcuts import render

mock_contacts = [
    {
        'name': 'City Official 1',
        'email': 'cityofficial1@gmail.com',
        'phone_number': '999-555-1212',
        'office_hours': '9am-5pm'
    },
    {
        'name': 'City Official 2',
        'email': 'cityofficial2@gmail.com',
        'phone_number': '999-555-3434',
        'office_hours': '9am-5pm'
    }
]

def main(request):
    return render(request, 'system/main.html', {'title': 'Home'})

def portal(request):
    return render(request, 'system/portal.html', {'title': 'Portal'})

def faq(request):
    return render(request, 'system/faq.html', {'title': 'FAQ'})

def contact(request):
    context = {
        'title': 'Contact',
        'contacts': mock_contacts
    }
    return render(request, 'system/contact.html', context)
