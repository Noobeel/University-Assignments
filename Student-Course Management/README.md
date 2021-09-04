<h1 align="center"> Simple Student Registry System </h1>

## Run Program
---
- Make sure that the latest [Java JDK](https://www.oracle.com/ca-en/java/technologies/javase-downloads.html) is installed on your system
- Download the source code
- Open a terminal of your choice and change current working directory to where the StudentRegistry folder is located
    - Note: Your current working directory should be outside the folder named StudentRegistry
- Run the following commands:
    ```
    javac ./StudentRegistry/*.java
    java ./StudentRegistry/StudentRegistrySimulator.java <Optional Filename Argument>
    ```
- An optional filename parameter can be given to the program containing commands, each on a seperate line (See example.txt)
    - Program Execution Command Example:
        ```
        java ./StudentRegistry/StudentRegistrySimulator.java example.txt
        ```


## Commands
---
Note: Ensure that there are spaces between parameters

### **Argument Restrictions**:
- <u>Student Name</u>: First and last name together, no spaces, case-insensitive

- <u>Student ID</u>: Numeric identification, exactly 6 digits long

- <u>Course Code</u>: 3 letters followed by 3 digits, case-insensitive, E.g Gcm012

- <u>Day</u>: One of MON (Monday), TUE (Tuesday), WED (Wednesday), THUR (Thursday), FRI (Friday)

- <u>Start Time</u>: Between 8:00 - 17:00 (24 Hour Format)

- <u>Duration</u>: Minimum 1 Hour, Maximum 3 Hours

- <u>Grade</u>: Minimum 0.0, Maximum 100.0

| **Commands** | **Description**                                | **Usage**                                           | **Example**                 |
|:------------:|------------------------------------------------|-----------------------------------------------------|-----------------------------|
| List         | Prints list of all students in registry        | > [L / List]                                        | > LIST                      |
| Quit         | Quits program                                  | > [Q / Quit / Exit]                                 | > QUIT                      |
| Clear        | Clears the screen                              | > [cls / clear]                                     | > cls                       |
| REG          | Adds new student into registry                 | > REG \<StudentName> \<StudentID>                   | > REG JohnCena 1100001      |
| DEL          | Deletes existing student from registry         | > DEL \<StudentID>                                  | > DEL 1100001               |
| ADDC         | Enrols student to an active course             | > ADDC \<StudentID> \<CourseCode>                   | > ADDC 1100001 CPS420       |
| DROPC        | Drops student from an active course            | > DROPC \<StudentID> \<CourseCode>                  | > DROPC 1100001 CPS420      |
| PAC          | Prints all active courses                      | > PAC                                               | > PAC                       |
| PCL          | Print list of students in an active course     | > PCL \<CourseCode>                                 | > PCL CPS420                |
| PGR          | Prints grades of all students in a course      | > PGR \<CourseCode>                                 | > PGR CPS420                |
| PSC          | Prints all active courses of a student         | > PSC \<StudentID>                                  | > PSC 1100001               |
| PST          | Prints student transcript                      | > PST \<StudentID>                                  | > PST 1100001               |
| SFG          | Sets final grade of a student for a course     | > SFG \<CourseCode> \<StudentID> \<Grade>           | > SFG CPS420 1100001 90.3   |
| SCN          | Sorts course list of students by name          | > SCN \<CourseCode>                                 | > SCN CPS420                |
| SCI          | Sorts course list of students by id            | > SCI \<CourseCode>                                 | > SCI CPS420                |
| SCH          | Sets a courses schedule                        | > SCH \<CourseCode> \<Day> \<StartTime> \<Duration> | > SCH CPS420 FRI 1200 2     |
| CSCH         | Clears a courses schedule                      | > CSCH \<CourseCode>                                | > CSCH CPS420               |
| PSCH         | Prints the schedule for a week                 | > PSCH                                              | > PSCH                      |
