package StudentRegistry;

import java.util.Scanner;
import java.util.TreeMap;
import java.util.ArrayList;
import java.util.NoSuchElementException;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.FileNotFoundException;
import java.nio.file.Path;
import java.nio.file.Files;
import java.nio.file.FileSystems;

// Student Registry

public class Registry {

	private TreeMap<String, Student> 	  students = new TreeMap<String, Student>();
	private TreeMap<String, ActiveCourse> courses  = new TreeMap<String, ActiveCourse>();

	/**
	 * Reads a list of students and courses from students.txt and courses.txt files respectively 
	 * (in the current working directory). Throws an exception if file not found or data in file
	 * has bad format.
	 *  
	 * 
	 * @throws FileNotFoundException  - If file not found
	 * @throws NoSuchElementException - If bad file format
	 */
	public Registry() throws FileNotFoundException, NoSuchElementException {
		
		String name;
		String id;

		try (Scanner fileScanner = new Scanner(new File("StudentRegistry\\students.txt"))) {

			while (fileScanner.hasNextLine()) {

				try (Scanner readLine = new Scanner(fileScanner.nextLine())) {
					
					readLine.useDelimiter(",");
					
					name = readLine.next();
					id   = readLine.next();

					Student student = new Student(name, id);
					students.put(id, student);

				} catch (NoSuchElementException e) {

					throw new NoSuchElementException("Bad File: students.txt");
				
				}
			}

		} catch (FileNotFoundException e) {
			
			throw new FileNotFoundException("students.txt : File Not Found!");
		
		}

	    ArrayList<Student> studentList = new ArrayList<Student>();
		String courseName;
		String courseCode;
		String courseDescription;
		String courseFormat;
		String courseSemester;

		try (Scanner fileScanner = new Scanner(new File("StudentRegistry\\courses.txt"))) {

			while (fileScanner.hasNextLine()) {

				try (Scanner readLine = new Scanner(fileScanner.nextLine())) {
					
					readLine.useDelimiter(",");

					courseName 		  = readLine.next();
					courseCode 		  = (readLine.next()).toLowerCase();
					courseDescription = readLine.next();
					courseFormat 	  = readLine.next();
					courseSemester 	  = readLine.next();

					courses.put(courseCode,
								new ActiveCourse(courseName,
												 courseCode,
												 courseDescription,
												 courseFormat,
												 courseSemester,
												 studentList
												)
							   );

				} catch (NoSuchElementException e) {
				
					throw new NoSuchElementException("Bad File: students.txt");
				
				}

			}

		} catch (FileNotFoundException e) {
			
			throw new FileNotFoundException("courses.txt : File Not Found!");

		}

	}

	/**
	 * @return Courses TreeMap
	 */
	public TreeMap<String, ActiveCourse> getCourses() {
		
		return this.courses;
	
	}

	/**
	 * Adds new student to the registry.
	 * 
	 * @param studentName - Name of student
	 * @param studentId   - Student ID
	 * @return true if student added, false if already exists
	 * @throws IOException
	 */
	public boolean addNewStudent(String studentName, String studentId) throws IOException {

		Student newStudent = new Student(studentName, studentId);

		for (Student student : students.values()) {

			if ((student.getId()).equals(studentId)) {

				if ((student.getName()).equals(studentName)) {

					System.out.println("Student with id: " + studentId +
									   " and name: " + studentName + " is already registered");
					return false;

				}

				System.out.println("Another student with the same ID is already registered");
				return false;

			}
			
		}

		Path path = FileSystems.getDefault().getPath("StudentRegistry\\students.txt");
		String[] studentsList = (Files.readString(path)).split("\n");

		try (FileWriter studentRegistryWriter = new FileWriter(new File("StudentRegistry\\students.txt"), false)) {
					
			for (int index = 0; index < studentsList.length; index++) {
			
				if (!studentsList[index].equals("")) {
					
					if (index != (studentsList.length - 1)) {

						studentRegistryWriter.write(studentsList[index] + "\n");
					
					} else {

						studentRegistryWriter.write(studentsList[index]);

					}
			
				}
			
			}
			
			studentRegistryWriter.flush();

		} catch (FileNotFoundException e) {
		
			throw new FileNotFoundException("students.txt : File Not Found!");
		
		}

		students.put(studentId, newStudent);

		try (FileWriter studentRegistryWriter = new FileWriter(new File("StudentRegistry\\students.txt"), true)) {

			studentRegistryWriter.write("\n" + studentName + "," + studentId);
			studentRegistryWriter.flush();

		} catch (FileNotFoundException e) {
		
			throw new FileNotFoundException("students.txt : File Not Found!");
		
		}

		return true;

	}

	/**
	 * Remove student from registry.
	 * 
	 * @param studentId - Student ID
	 * @return true if student removed, false if doesn't already exist
	 */
	public boolean removeStudent(String studentId) throws IOException {

		for (String studentKey : students.keySet()) {

			if (studentKey.equals(studentId)) {

				students.remove(studentKey);
				
				Path path = FileSystems.getDefault().getPath("StudentRegistry\\students.txt");
				String[] studentsList = (Files.readString(path)).split("\n");

				for (int index = 0; index < studentsList.length; index++) {

					String[] current = (studentsList[index]).split(",");

					if ((current[1].trim()).equals(studentId)) {

						studentsList[index] = "";
						break;
					
					}

				}

				try (FileWriter studentRegistryWriter = new FileWriter(new File("StudentRegistry\\students.txt"), false)) {
					
					for (int index = 0; index < studentsList.length; index++) {
					
						if (!studentsList[index].equals("")) {
							
							if (index != (studentsList.length - 1)) {

								studentRegistryWriter.write(studentsList[index] + "\n");
							
							} else {

								studentRegistryWriter.write(studentsList[index]);

							}
					
						}
					
					}
					
					studentRegistryWriter.flush();
		
				} catch (FileNotFoundException e) {
				
					throw new FileNotFoundException("students.txt : File Not Found!");
				
				}

				return true;
			
			}

		}

		System.out.println("Student with id " + studentId + " could not be found.");

		return false;
	
	}

	/**
	 * Prints all registered students
	 */
	public void printAllStudents() {

		System.out.println("List of Registered Students:");
		
		for (String key : students.keySet()) {
			
			System.out.println("ID: " + key + " Name: " + students.get(key).getName());
		
		}

	}

	/**
	 * Adds student to an active course.
	 * 
	 * @param studentId  - Student ID
	 * @param courseCode - Course Code
	 */
	public void addCourse(String studentId, String courseCode) {
		
		for (String studentKey : students.keySet()) {

			if (studentKey.equals(studentId)) {

				Student student = students.get(studentKey);
				
				ArrayList<CreditCourse> studentEnrolledCourses = student.courses;

				for (CreditCourse courseEnrolled : studentEnrolledCourses ) {

					if (courseEnrolled.getCode().equals(courseCode)) {

						System.out.println("Student is already enrolled in course with code: " + courseCode);
						return;

					}

				}

				for (String courseKey : courses.keySet()) {

					if (courseKey.equals(courseCode)) {
						
						ActiveCourse course = courses.get(courseKey);

						course.addStudent(student);
						student.addCourse(course.getName(),
										  courseKey,
										  course.getDescription(),
										  course.getFormat(),
										  course.getSemester(),
										  0);
						return;

					}
				}

				System.out.println("Course with code " + courseCode + " not found");

			}
		}
	}

	/**
	 * Drops a student from an active course.
	 * 
	 * @param studentId  - Student ID
	 * @param courseCode - Course Code
	 */
	public void dropCourse(String studentId, String courseCode) {

		for (String courseKey : courses.keySet()) {

			if (courseKey.equals(courseCode)) {

				for (String studentKey : students.keySet()) {

					if (studentKey.equals(studentId)) {

						courses.get(courseKey).removeStudent(students.get(studentKey));
						students.get(studentKey).removeActiveCourse(courseCode);
						return;

					}

				}
				
				System.out.println("Student with id " + studentId + " not found");
				return;

			}

		}

		System.out.println("Course with code " + courseCode + " not found");

	}

	/**
	 * Prints all active courses.
	 */
	public void printActiveCourses() {

		for (String courseKey : courses.keySet()) {

			System.out.println(courses.get(courseKey).getDescription());

		}

	}

	/**
	 * Prints a list of students in an active course.
	 * 
	 * @param courseCode - Course Code
	 */
	public void printClassList(String courseCode) {

		for (String courseKey : courses.keySet()) {

			if (courseKey.equals(courseCode)) {

				courses.get(courseKey).printClassList();
				return;

			}

		}

		System.out.println("Course with code " + courseCode + " not found");

	}

	/**
	 * Sorts student list by name taking specified course.
	 * 
	 * @param courseCode - Course Code
	 */
	public void sortCourseByName(String courseCode) {

		for (String courseKey : courses.keySet()) {

			if (courseKey.equals(courseCode)) {

				courses.get(courseKey).sortByName();
				return;

			}

		}

		System.out.println("Course with code " + courseCode + " not found");

	}

	/**
	 * Sorts student list by student id taking specified course.
	 * 
	 * @param courseCode - Course Code
	 */
	public void sortCourseById(String courseCode) {

		for (String courseKey : courses.keySet()) {

			if (courseKey.equals(courseCode)) {

				courses.get(courseKey).sortById();
				return;

			}

		}

		System.out.println("Course with code " + courseCode + " not found");

	}

	/**
	 * Prints student names and grades for specified course.
	 * 
	 * @param courseCode - Course Code
	 */
	public void printGrades(String courseCode) {

		for (String courseKey : courses.keySet()) {

			if (courseKey.equals(courseCode)) {

				courses.get(courseKey).printGrades();
				return;

			}

		}

		System.out.println("Course with code " + courseCode + " not found");

	}

	/**
	 * Prints all active courses the student is enrolled in.
	 * 
	 * @param studentId - Student ID
	 */
	public void printStudentCourses(String studentId) {

		for (String studentKey : students.keySet()) {

			if (studentKey.equals(studentId)) {

				students.get(studentKey).printActiveCourses();
				return;

			}

		}

		System.out.println("Student with id " + studentId + " not found");

	}

	/**
	 * Prints all completed courses and grades of a student.
	 * 
	 * @param studentId - Student ID
	 */
	public void printStudentTranscript(String studentId) {

		for (String studentKey : students.keySet()) {

			if (studentKey.equals(studentId)) {

				students.get(studentKey).printTranscript();
				return;

			}

		}

		System.out.println("Student with id " + studentId + " not found");

	}

	/**
	 * Sets the final grade for a specified course of a student.
	 * 
	 * @param courseCode - Course Code
	 * @param studentId  - Student ID
	 * @param grade      - Final Grade
	 */
	public void setFinalGrade(String courseCode, String studentId, double finalGrade) {

		for (String courseKey : courses.keySet()) {

			if (courseKey.equals(courseCode)) {

				for (String studentKey : students.keySet()) {

					if (studentKey.equals(studentId)) {

						Student student = students.get(studentKey);
						ArrayList<CreditCourse> studentEnrolledCourses = student.courses;

						for (CreditCourse courseEnrolled : studentEnrolledCourses) {
							
							if (courseEnrolled.getCode().equals(courseCode)) {

								courseEnrolled.setGrade(finalGrade);
								student.setGrade(finalGrade);
								courseEnrolled.setInactive();
								return;

							}

						}

						System.out.println("Student is not yet enrolled in the course with code: " + courseCode);
						return;

					}

				}

				System.out.println("Student with id: " + studentId + " not found");
				return;
				
			}

		}

		System.out.println("Course with code " + courseCode + " not found");

	}
}
