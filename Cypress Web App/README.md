<h1 align="center"> Cypress System - Web Application </h1>

## Cypress Requirements Document
---
### References:
To develop the Cypress application, Django, a Python web framework, and the Google Maps API for identifying addresses on a visual map inside Cypress reports were used.

The links to all the resources that contributed towards the completed application include the following: <br>
- Django 3.2 Documentation
- Django Packages:
    - Crispy Forms
    - Axes
    - Simple Captcha
    - Storages
    - Boto
- Google Maps Platform Documentation
- AWS S3 Documentation

---
### Run locally:
- Ensure python is installed on your computer
- Download files from Github repository
- Open a terminal and change directory into extracted location
- Create and activate a python virtual environment using the following link (optional):
    [Create Python Virtual Environment](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/#creating-a-virtual-environment)
- Enter the following command in your terminal:
    ```
    pip install -r requirements.txt
    ```
- Requirements for Cypress Application will be installed
- Ensure that the file named `manage.py` is in your current working directory
- Enter the following commands in your terminal:
    ```
    python manage.py makemigrations
    python manage.py migrate
    python manage.py runserver 8000
    ```
- Server will be hosted locally at [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- Enter this address in the browser of your choosing to view the web app locally
- To kill the web-server, enter the ctrl-C command in the terminal

---
### Accessing Admin Site:
- When using the website hosted online:
    - SuperUser Admin:
        - Username: admin
        - Password: A9h{Mm4n
    - City Of Toronto Staff Account:
        - Username: CityOfToronto
        - Password: dPt9TeX
    - Note: The CityOfToronto account has less permissions than the SuperUser account. It
       can be given to a City of Toronto representative who can mark reports as
       Completed (See Use Case 10: Report Resolution).

---
## Functional Requirements
The use cases implemented in this project taken from the Cypress specification functional
requirements are listed below. Any changes made to the specification are highlighted and any omitted functionality is crossed out.

### Use Case 1: Language Selection
    Primary Actor: User
    Precondition: None
    Main Scenario:
        User arrives at website, default language is set to English
    Alternative flow:
        User clicks on language option button to change language to French

### Use Case 2: Registration
    Primary Actor: User
    Secondary Actor: System
    Precondition: None
    Main Scenario:
        1. User goes to website, and clicks register option button and is redirected.
        2. User must agree to terms and conditions of this site
        3. User provides personal information and login name and password
        4. System checks that password is secure enough and login name is free
        5. User is taken back to main page of website
    Alternative flow:
        4. (a). Login name/password is not secure. User is re-prompted to enter new login name / password

### Use Case 3: Login
    Primary Actor: User
    Secondary Actor: System
    Precondition: User must be registered.
    Main Scenario:
        1. Go to website and click login button
        2. User gives login info
        3. System checks user info
        4. User is redirected to the main portal
    Alternative flow:
        4. (A) Login fails
            4. (A) 1. Re-prompt for login info
            4. (A) 2. User is allowed to enter info 3 times before being banned for an hour
        4. (B) User forgot password
            4. (B) 1. User is prompted for answer to secret question
            4. (B) 2. User is asked to enter the email address associated with their account
            4. (B) 3. User is sent a confirmation email
            4. (B) 4. User is redirected to a page where they can enter their account info
            4. (B) 5. Upon successfully setting their password, the user is redirected to a confirmation page

### Use Case 4: Change Information
    Primary Actor: User
    Precondition: Must be logged in
    Main Scenario:
        1. User clicks on profile information tab
        2. All the profile info is displayed (password, address, number, name, email, etc.)
        3. User clicks save and exit when finished changing profile
        Alternate Scenario:
            3. If all required fields are not filled out, user is promted to fill in the required fields before exiting

### Use Case 5: Delete Profile
    Primary Actor: User
    Precondition: User is logged in and is on their profile page
    Main Scenario:
        1. User clicks delete profile button
        2. User is prompted for answer to secret question (to make sure it is the correct person)
        3. User is prompted if he or she is sure they want to delete profile
        4. User information is erased from system along with reports
        5. User is redirected to the main portal page

### Use Case 6: Create Report/Report a Problem
    Primary Actor: User
    Precondition: User is logged in
    Main Scenario:
        1. User clicks on create a report (“Report A Problem”) tab
        2. User is prompted for a location on the interactive city map
        3. User is prompted for complaint about the selected area
        4. User is prompted to subscribe to email notifications
        5. User then saves report and exits
    Alternative flow:
        4. (a) a required field is missing and user cannot save and exit
            4. (a)1. User is prompted to fill information for the required field

### Use Case 7: Edit Report
    Primary Actor: User
    Secondary Actor: System
    Precondition: User is logged in
    Main Scenario:
        1. User clicks edit report (“Update My Reports”) tab
        2. System displays a list of all the logged-in user’s reports
        3. User clicks the “Edit” button on a report to edit it
        4. User is prompted to enter a city area via an interactive map
        5. User is prompted for a problem
        6. User then saves report and exits
    Alternative flow:
        6. (a) A required field is missing and the User cannot save and exit
            6. (a)1. User is prompted to fill information for the required field

### Use Case 8: Delete Report
    Primary Actor: User
    Secondary Actor: System
    Precondition: User is logged in
    Main Scenario:
        1. User clicks delete report (“Update My Reports”) tab
        2. System displays a list of all the logged-in user’s reports
        3. User clicks the “Delete” button on a desired report to delete it
        4. System prompts the User if he/she is sure before deleting the report

### Use Case 9: Report Resolution
    Primary Actor: System
    Secondary Actor: City Officials
    Precondition: None
    Main Scenario:
        1. System notifies city officials about the problem
        2. A city official has an associated staff account which they can use to go through all reports
        3. City Officials try their best to resolve conflict and then gets back to the system tech with the course of action being taken
        4. The city official can click the “Mark Complete” button under a report to mark it as completed
        5. System emails the user at the address associated with their account and informs them that the problem has been resolved and thanks them for their contribution.

### Use Case 10: Suggest
    Primary Actor: User
    Secondary Actor: System
    Precondition: User is logged in.
    Main Scenario:
        1. User clicks suggest tab
        2. System displays a list of reports to the User
        3. User clicks on the report and options are shown
    Alternative flow
        3. (a) User clicks like button
            3. (b) User suggests a possible solution for the problem and submits it

### Use Case 11: Contacting
    Primary Actor: User
    Secondary Actor: System
    Precondition: User needs to speak to a city official.
    Main Scenario:
        1. User clicks on contact us tab
        2. System displays a list of city officials to choose from
        3. User picks city official and their contact information and office hours are displayed

### Use Case 12: FAQ Questioning
    Primary Actor: User
    Precondition: User is unsure about a specific matter.
    Main Scenario:
        1. User clicks FAQ button on the bottom right of their screen
        2. A list of frequently asked questions are shown to the user
        3. User clicks on a question to display its answer

### Use Case 13: Logout
    Primary Actor: User
    Precondition: User is logged in.
    Main Scenario:
        1. User clicks the logout button
        2. User is redirected to the main page of the site a confirmation screen

### Use Case 14: Home
    Primary Actor: User
    Precondition: None
    Main Scenario:
        1. User clicks on home (CYPRESS) tab
        2. User is redirected to main portal area

### Use Case 15: Vote
    Primary Actor: User
    Secondary Actor: System
    Precondition: None
    Main Scenario:
    1. User clicks on the “View All Reports” tab
    2. Systems displays a list of all reports to vote from
        2. (A). If A report is marked as being completed, the user cannot vote on that report
    3. System tracks the number of votes and displays the results thus far under each report

## Test Plan
---
### Introduction:
    To test the functionality of our Cypress application, our team decided to stick to a
    simple approach of manually testing each new feature added, alongside regression testing to
    see if the newly added features do not break the old ones. As our software is user-oriented
    with most of the functionality available to the user themselves, we believe that this level of
    manual testing is adequate to ensure the proper functionality of the product. We will be
    focusing on the important functionalities of the Cypress app, being grouped broadly into the
    following categories: 
    User Management and Authentication, Report Creation and Management, and other use cases.

    User Management and Authentication covers the use case classes of system authorization, registering, information change, and logout. These use cases function as intended, with the user information being stored on AWS S3 and PostgreSQL (SQLite only if run locally) database to ensure data is carried over and remembered for the next time the user returns to the web app.

    Report Creation and Management covers the use case classes of creating a report, editing a report, deleting a report, and voting on a report. Similar to before, the information is
    stored in a database and is accessible through the web app, giving immediate feedback as to what information was successfully logged.

    Other use cases contain the smaller functionalities of the application, like the language selection, FAQ questioning, contacting, as well as report resolution and notification. Time
    permitting, certain features may be included or not.

### Feature: Management and Authentication
---
| Test Case          | Description                                         | Input                                       | Expected                                          | Result      |
|--------------------|-----------------------------------------------------|---------------------------------------------|---------------------------------------------------|-------------|
| Login              | User should be able to log into their account       | Username and password                       | Cypress remembers registration and allows a login | As expected |
| Cancel             | User cancels login                                  | Cancel button pressed                       | User is returned to the main page                 | As expected |
| Enter Information  | User enters information for registration            | Username, Email, Full Name, Password        | Cypress creates an account for the user           | As expected |
| Create Username    | This case is covered by enter information           |                                             |                                                   |             |
| Create Password    | This case is covered by enter information           |                                             |                                                   |             |
| Change Information | The user can change their information in the system | Desired field to change (name, email, etc.) | Change is registered in the system                | As expected |
| Logout             | The user logs out of their account                  | Logout button pressed                       | User is logged out                                | As expected |

### Feature: Report Creation and Management:
---
| Test Case     | Description                                                                                               | Input                                                                                        | Expected                                           | Result      |
|---------------|-----------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|----------------------------------------------------|-------------|
| Create Report | User selects an address on google maps and a problem type as well as option to subscribe to notifications | Address chosen on google maps plugin, report type in drop-down menu, and notification option | Report is saved and available for the user to edit | As expected |
| Edit Report   | User selects an existing report and changes details                                                       | Existing report, chosen address, report type, notification choice                            | Report is updated in the system to reflect changes | As expected |
| Delete Report | User selects an existing report to delete                                                                 | Existing report                                                                              | Report is removed from the system                  | As expected |

### Feature: Other Use Cases:
---
| Test Case         | Description                                                                                                                                                           | Input                                                               | Expected                                                                                              | Result                         |
|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|--------------------------------|
| Select Language   | At start, user selects a language                                                                                                                                     | English or French option chosen                                     | User is directed to language version of site                                                          | French version not implemented |
| Report Resolution | A city official with a staff account marks a report as completed in the "View All Reports" page. User who created the report gets an email notification if subscribed | "Mark Completed" option selected by staff                           | User gets an email if subscribed to notifications. Like, edit, and delete buttons not available after | As expected                    |
| Notification      | This case is covered by report resolution                                                                                                                             |                                                                     |                                                                                                       |                                |
| FAQ Question      | User is directed to the frequently asked questions page when they click the FAQ button                                                                                | Click the FAQ button placed at the bottom right of the screen       | Redirected to FAQ page                                                                                | As expected                    |
| Contact           | User is directed to the contact information page for city officials when they click the "Contact Us" button                                                           | Click the "Contact Us" button placed in the menu on the portal page | Redirected to Contact page                                                                            | As expected                    |
