package StudentRegistry;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

// Active University Courses

public class ActiveCourse extends Course {

   private ArrayList<Student> students = new ArrayList<Student>();
   private String semester;
   private String lectureDay;
   private int    lectureStart;
   private int    lectureDuration;

   /**
    * Constructor Method: Initializes instance variables.
    * 
    * @param name        - Course Name
    * @param code        - Course Code
    * @param description - Course Description
    * @param format      - Course Format
    * @param semester    - Current Semester
    * @param students    - List of students taking course
    */
   public ActiveCourse(String name, String code, String description, String format, String semester, ArrayList<Student> students) {
      
      super(name, code, description, format);
      
      this.semester        = semester;
      this.students        = new ArrayList<Student>(students);
      this.lectureDay      = "";
      this.lectureStart    = 0;
      this.lectureDuration = 0;

   }

   /**
    * @return Current course semester
   */
   public String getSemester() {

      return this.semester;

   }

   /**
    * Sets lecture day for course.
    * 
    * @param day - Day
    */
   public void setDay(String day) {

      this.lectureDay = day;
   
   }

   /**
    * Sets start time for course.
    * 
    * @param starttime - Start Time
    */
   public void setStart(int startTime) {

      this.lectureStart = startTime;

   }

   /**
    * Sets duration for course.
    * 
    * @param duration - Duration
    */
   public void setDuration(int duration) {

      this.lectureDuration = duration;
   
   }

   /**
    * Resets schedule for course.
    * 
    * @param duration - Duration
    */
    public void resetSchedule() {

      this.lectureDay = "";
      this.lectureStart = 0;
      this.lectureDuration = 0;
   
   }

   /**
    * @return Lecture day
    */
   public String getDay() {
      
      return this.lectureDay;

   }

   /**
    * @return - Lecture start time
    */
   public int getStartTime() {

      return this.lectureStart;

   }

   /**
    * @return - Lecture duration
    */
   public int getDuration() {

      return this.lectureDuration;

   }

   /**
    * @return Lecture end time
    */
   public int getEndTime() {

      return this.lectureStart + ((this.lectureDuration - 1) * 100); // Check

   }

   /**
    * Adds student to active course. Checks if student already enrolled before
    * adding.
    * 
    * @param student - Student to be added
    */
   public void addStudent(Student student) {

      if (students.contains(student)) {
         
         System.out.println("Student is already enrolled in this course.");
      
      } else {

         students.add(student);

      }

   }

   /**
    * Removes student from active course.
    * 
    * @param student - Student to be removed
    */
   public void removeStudent(Student student) {

      if (!students.contains(student)) {
         
         System.out.println("Student is not enrolled in this course.");
      
      } else {

         students.remove(student);

      }

   }

   /**
    * Prints name and id of all students taking current course.
    */
   public void printClassList() {
      
      if (students.isEmpty()) {

         System.out.println("No students taking current course");
         return;

      }

      System.out.println("Student List:");

      for (Student student : students) {

         System.out.println(student);

      }

   }

   /**
    * Prints grade, name, and id of each student taking current course.
    */
   public void printGrades() {

      if (students.isEmpty()) {

         System.out.println("No students taking current course");
         return;

      }

      for (Student student : students) {

         System.out.print(student);
         System.out.print(", Course Grade: " + student.getGrade() + "\n");

      }

   }

   /**
    * Gets the grade of a student taking this course.
    * 
    * @param studentId - Student ID
    * @return Returns 0 if student not found else returns grade
    */
   public double getGrade(String studentId) {

      for (Student student : students) {

         if (student.getId().equals(studentId)) {

            for (CreditCourse course : student.courses) {

               if (course.getCode().equals(this.getCode())) {

                  return course.getGrade();

               }

            }

         }

      }

      return 0;
   
   }

   /**
    * Gets course information of current course.
    * 
    * @return Course name, code, description, format, semester and number of
    *         students currently enrolled
    */
   public String getDescription() {

      return super.getDescription() +
			   "Semester: " + this.semester + "\n" + 
			   "Number of Students Enrolled: " + students.size() + "\n";

   }

   /**
    * Sorts students taking course by name.
    */
   public void sortByName() {

      Collections.sort(students, new NameComparator());

   }

   /**
    * Sorts students taking course by student id.
    */
   public void sortById() {

      Collections.sort(students, new IdComparator());

   }

   /**
    * Compares names of two given students.
    */
    private class NameComparator implements Comparator<Student> {

      public int compare(Student a, Student b) {

         return a.getName().compareTo(b.getName());

      }

   }

   /**
    * Compares id's of two given students.
    */
   private class IdComparator implements Comparator<Student> {

      public int compare(Student a, Student b) {
      
         return a.getId().compareTo(b.getId());
      
      }
   
   }

}
