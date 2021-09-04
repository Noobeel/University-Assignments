package StudentRegistry;

import java.util.ArrayList;

// Student Identification

public class Student implements Comparable<Student> {

	private String name;
	private String id;
	private double grade;
	public ArrayList<CreditCourse> courses;

	/**
	 * Constructor Method: Initialize instance variables and creates new course
	 * list.
	 * 
	 * @param name - Student Name
	 * @param id   - Student ID
	 */
	public Student(String name, String id) {

		this.name    = name;
		this.id   	 = id;
		this.courses = new ArrayList<CreditCourse>();

	}

	/**
	 * Sets grade.
	 * 
	 * @param grade - Grade
	 */
	public void setGrade(double grade) {

		this.grade = grade;

	}

	/**
	 * @return Grade
	 */
	public double getGrade() {

		return this.grade;

	}

	/**
	 * @return Student ID
	 */
	public String getId() {

		return this.id;

	}

	/**
	 * @return Student Name
	 */
	public String getName() {

		return this.name;

	}

	/**
	 * Adds course to students credit courses.
	 * 
	 * @param courseName  - Course Name
	 * @param courseCode  - Course Code
	 * @param description - Course Description
	 * @param format      - Course Format
	 * @param semester    - Current Semester
	 * @param grade       - Grade
	 */
	public void addCourse(String courseName, String courseCode, String description, String format, String semester, double grade) {

		CreditCourse course = new CreditCourse(courseName, courseCode, description, format, semester, grade);
		courses.add(course);

	}

	/**
	 * Prints student transcript containing course code, course name,
	 * current semester, and letter grade.
	 */
	public void printTranscript() {

		if (courses.isEmpty()) {
			
			System.out.println("Student has not taken any courses.");
			return;

		}

		System.out.println("Student Transcript:");

		for (CreditCourse course : courses) {

			if (!course.getActive()) {

				System.out.println(course.displayGrade());

			}

		}

	}

	/**
	 * Prints all active courses of student.
	 */
	public void printActiveCourses() {
		
		if (courses.isEmpty()) {
			
			System.out.println("Student has no active courses.");
			return;

		}

		System.out.println("Students Active Courses:");

		for (CreditCourse course : courses) {

			if (course.getActive()) {

				System.out.println(course.getDescription());

			}

		}

	}

	/**
	 * Drops an active course with the given course code for student.
	 * 
	 * @param courseCode - Course Code
	 */
	public void removeActiveCourse(String courseCode) {

		if (courses.isEmpty()) {
			
			System.out.println("Student has no active courses.");
			return;

		}

		for (CreditCourse course : courses) {

			if ((course.getCode()).equals(courseCode) && course.getActive()) {

				courses.remove(course);
				return;

			}

		}

		System.out.println("Student has no active course with code: " + courseCode);

	}

	/**
	 * @return Student ID and Student Name
	 */
	public String toString() {

		return "Student ID: " + this.id + ", Student Name: " + this.name;

	}

	/**
	 * Compares name and id of two given students.
	 * 
	 * @param other - Student Object
	 * @return - true if name and id equal else false
	 */
	public boolean equals(Object other) {

		Student otherStudent = (Student) other;

		if ((this.name.equals(otherStudent.name)) && 
			(this.id.equals(otherStudent.id))) {

			return true;

		}

		return false;
	
	}

	/**
	 * Compares names of two given students. (Comparable Interface)
	 */
	public int compareTo(Student other) {

		return this.name.compareTo(other.name);

	}

}
