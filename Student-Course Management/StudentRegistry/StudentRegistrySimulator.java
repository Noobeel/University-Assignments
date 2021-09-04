package StudentRegistry;

import java.util.Scanner;
import java.util.InputMismatchException;
import java.util.NoSuchElementException;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;

// User - CLI interaction

public class StudentRegistrySimulator {

	public static void main(String[] args) {

		try (Scanner scanner = new Scanner(System.in)) {

			Registry  registry  = new Registry();
			Scheduler scheduler = new Scheduler(registry.getCourses());

			if (args.length == 1) {

				String filename = args[0];

				try (Scanner fileScan = new Scanner(new File("StudentRegistry\\" + filename))) {
					
					String line;

					while (fileScan.hasNextLine()) {
						
						line = fileScan.nextLine();
						
						System.out.println("\nExecuting Command: " + line + "\n");

						if (!executeCommand(registry, scheduler, line)) {

							return;

						}

					}

				} catch (FileNotFoundException e) {
				
					System.out.println(filename + " : File not found!");
				
				} catch (NoSuchElementException e) {

					System.out.println("Bad File: " + filename);
				}
				
			}

			while (true) {
				
				System.out.print("> ");
				String inputLine = scanner.nextLine();

				if (inputLine == null || (inputLine.trim()).equals("")) {

					System.out.println("No command entered. Please enter a valid command!");
					continue;

				}

				if (!executeCommand(registry, scheduler, inputLine)) {
					
					break;
				
				}

			}

		} catch (FileNotFoundException | NoSuchElementException e) {
			
			System.out.println(e.getMessage());
		
		}

	}

	private static boolean executeCommand(Registry registry, Scheduler scheduler, String inputLine) {

		Boolean valid = true;
		final int ID_LENGTH = 6;

		try (Scanner commandLine = new Scanner(inputLine)) {

			String id;
			String day;
			String name;
			String courseCode;
			int startTime;
			int duration;
			Double finalGrade;

			String command = (commandLine.next()).toLowerCase();

			if (command.equals("l") || command.equals("list")) {
				
				registry.printAllStudents();

			} else if (command.equals("q") || command.equals("quit") || command.equals("exit")) {
				
				System.out.println("\nBye!\n");
				return false;

			} else if (command.equals("cls") || command.equals("clear")) {
				
				new ProcessBuilder("cmd", "/c", "cls").inheritIO().start().waitFor();

			} else {
				switch (command) {

					case "reg":
						
						try {

							name = commandLine.next();
							id   = commandLine.next();

							if (!isStringOnlyAlphabet(name)) {
								System.out.println("Invalid Characters in Name " + name);
								valid = false;
							}

							if (!isNumeric(id)) {
								System.out.println("Invalid Characters in ID " + id);
								valid = false;
							}

							if (id.length() != ID_LENGTH) {
								System.out.println("ID needs to be 6 digits long.");
								valid = false;
							}
							
							if (valid) {
								registry.addNewStudent(name, id);
							}

						} catch (NoSuchElementException e) {
						
							throw new NoSuchElementException("Missing Parameters!");
						
						} catch (IOException e) {

							System.out.println(e.getMessage());

						}

						break;
					
					case "del":

						try {

							id = commandLine.next();

							if (!isNumeric(id)) {

								System.out.println("Invalid Characters in ID " + id);

							} else if (id.length() != ID_LENGTH) {

								System.out.println("ID needs to be 6 digits long.");

							} else {

								registry.removeStudent(id);

							}

						} catch (NoSuchElementException e) {
						
							throw new NoSuchElementException("Missing Parameters!");
						
						} catch (IOException e) {

							System.out.println(e.getMessage());

						}

						break;

					case "addc":

						try {

							id 		   = commandLine.next();
							courseCode = (commandLine.next()).toLowerCase();

							if (!isNumeric(id)) {
								System.out.println("Invalid Characters in ID " + id);
								valid = false;
							}

							if (id.length() != ID_LENGTH) {
								System.out.println("ID needs to be 6 digits long.");
								valid = false;
							}

							if (isNumeric(courseCode) || isStringOnlyAlphabet(courseCode) || !isValidCourseCode(courseCode)) {
								System.out.println("Invalid Course Code " + courseCode);
								valid = false;
							}

							if (valid) {
								registry.addCourse(id, courseCode);
							}

						} catch (NoSuchElementException e) {
						
							throw new NoSuchElementException("Missing Parameters!");
						
						}

						break;
						
					case "dropc":

						try {

							id 		   = commandLine.next();
							courseCode = (commandLine.next()).toLowerCase();

							if (!isNumeric(id)) {
								System.out.println("Invalid Characters in ID " + id);
								valid = false;
							}

							if (id.length() != ID_LENGTH) {
								System.out.println("ID needs to be 6 digits long.");
								valid = false;
							}

							if (isNumeric(courseCode) || isStringOnlyAlphabet(courseCode) || !isValidCourseCode(courseCode)) {
								System.out.println("Invalid Course Code " + courseCode);
								valid = false;
							}

							if (valid) {
								registry.dropCourse(id, courseCode);
							}

						} catch (NoSuchElementException e) {
						
							throw new NoSuchElementException("Missing Parameters!");
						
						}

						break;

					case "pac":

						registry.printActiveCourses();
						break;

					case "pcl":

						try {

							courseCode = (commandLine.next()).toLowerCase();

							if (isNumeric(courseCode) || isStringOnlyAlphabet(courseCode) || !isValidCourseCode(courseCode)) {
								System.out.println("Invalid Course Code " + courseCode);
							} else {
								registry.printClassList(courseCode);
							}

						} catch (NoSuchElementException e) {
						
							throw new NoSuchElementException("Missing Parameters!");
						
						}

						break;

					case "pgr":

						try {

							courseCode = (commandLine.next()).toLowerCase();

							if (isNumeric(courseCode) || isStringOnlyAlphabet(courseCode) || !isValidCourseCode(courseCode)) {
								System.out.println("Invalid Course Code " + courseCode);
							} else {
								registry.printGrades(courseCode);
							}

						} catch (NoSuchElementException e) {
						
							throw new NoSuchElementException("Missing Parameters!");
						
						}

						break;

					case "psc":

						try {

							id = commandLine.next();

							if (!isNumeric(id)) {

								System.out.println("Invalid Characters in ID " + id);

							} else if (id.length() != ID_LENGTH) {

								System.out.println("ID needs to be 6 digits long.");

							} else {

								registry.printStudentCourses(id);

							}

						} catch (NoSuchElementException e) {
						
							throw new NoSuchElementException("Missing Parameters!");
						
						}

						break;

					case "pst":

						try {

							id = commandLine.next();

							if (!isNumeric(id)) {

								System.out.println("Invalid Characters in ID " + id);

							} else if (id.length() != ID_LENGTH) {

								System.out.println("ID needs to be 6 digits long.");

							} else {

								registry.printStudentTranscript(id);

							}

						} catch (NoSuchElementException e) {
						
							throw new NoSuchElementException("Missing Parameters!");
						
						}

						break;

					case "sfg":
					
						try {

							courseCode = (commandLine.next()).toLowerCase();
							id         = commandLine.next();
							finalGrade = Double.parseDouble(commandLine.next());

							if (!isNumeric(id)) {
								System.out.println("Invalid Characters in ID " + id);
								valid = false;
							}

							if (id.length() != ID_LENGTH) {
								System.out.println("ID needs to be 6 digits long.");
								valid = false;
							}

							if (isNumeric(courseCode) || isStringOnlyAlphabet(courseCode) || !isValidCourseCode(courseCode)) {
								System.out.println("Invalid Course Code " + courseCode);
								valid = false;
							}
							
							if (valid) {
								registry.setFinalGrade(courseCode, id, finalGrade);
							}

						} catch (NoSuchElementException e) {
						
							throw new NoSuchElementException("Missing Parameters!");
						
						}

						break;

					case "scn":

						try {

							courseCode = (commandLine.next()).toLowerCase();

							if (isNumeric(courseCode) || isStringOnlyAlphabet(courseCode) || !isValidCourseCode(courseCode)) {
								System.out.println("Invalid Course Code " + courseCode);
							} else {
								registry.sortCourseByName(courseCode);
							}

						} catch (NoSuchElementException e) {
						
							throw new NoSuchElementException("Missing Parameters!");
						
						}

						break;

					case "sci":

						try {

							courseCode = (commandLine.next()).toLowerCase();

							if (isNumeric(courseCode) || isStringOnlyAlphabet(courseCode) || !isValidCourseCode(courseCode)) {
								System.out.println("Invalid Course Code " + courseCode);
							} else {
								registry.sortCourseById(courseCode);
							}
							
						} catch (NoSuchElementException e) {
						
							throw new NoSuchElementException("Missing Parameters!");
						
						}

						break;

					case "sch":

						try {

							courseCode = (commandLine.next()).toLowerCase();
							day 	   = (commandLine.next()).toLowerCase();
							startTime  = commandLine.nextInt();
							duration   = commandLine.nextInt();

							if (isNumeric(courseCode) || isStringOnlyAlphabet(courseCode) || !isValidCourseCode(courseCode)) {
								System.out.println("Invalid Course Code " + courseCode);
							} else {
								// Day, Start time, Duration argument checks done in Scheduler class
								scheduler.setDayAndTime(courseCode, day, startTime, duration);
							}

						} catch (InputMismatchException e) {
						
							throw new InputMismatchException("Invalid parameters entered.");
						
						} catch (NoSuchElementException e) {
						
							throw new NoSuchElementException("Missing Parameters!");
						
						}

						break;

					case "csch":

						try {
						
							courseCode = (commandLine.next()).toLowerCase();

							if (isNumeric(courseCode) || isStringOnlyAlphabet(courseCode) || !isValidCourseCode(courseCode)) {
								System.out.println("Invalid Course Code " + courseCode);
							} else {
								scheduler.clearSchedule(courseCode);
							}
						
						} catch (NoSuchElementException e) {
						
							throw new NoSuchElementException("Missing Parameters!");
						
						}

						break;

					case "psch":

						scheduler.printSchedule();
						break;
					
					default:
						
						System.out.println("Command not found: " + command);
						break;	

				}

			}

		} catch (NoSuchElementException | LectureTimeCollisionException | InvalidDayException |
				 InvalidTimeException | InvalidDurationException | InterruptedException | IOException e) {
			
			System.out.println(e.getMessage());
		
		}

		return true;

	}

	/**
	 * Checks if given string consists of alphabets only.
	 * 
	 * @param str - Given String
	 * @return True if input string consists of alphabets only else False
	 */
	private static boolean isStringOnlyAlphabet(String str) {
		
		if (str == null) {
			
			return false;
		
		}

		for (int i = 0; i < str.length(); i++) {

			if (!Character.isLetter(str.charAt(i))) {
				
				return false;
			
			}

		}

		return true;
	
	}

	/**
	 * Checks if given string consists of numbers only.
	 * 
	 * @param str - Given String
	 * @return True if input string consists of numbers only else False
	 */
	public static boolean isNumeric(String str) {
		
		for (int i = 0; i < str.length(); i++) {
			
			if (!Character.isDigit(str.charAt(i))) {
				
				return false;
			
			}

		}
		
		return true;

	}

	/**
	 * Checks if given course code is of correct format.
	 * Example: CPS209; (First 3 Letters, Last 3 Digits)
	 * 
	 * @param courseCode - Given course code as a string
	 * @return True if course code is of correct format else False
	 */
	public static boolean isValidCourseCode(String courseCode) {

		int charCount = 0;
		int numCount = 0;

		for (char currentChar : courseCode.toCharArray()) {

			if (Character.isLetter(currentChar)) {

				charCount++;
			
			} else if (Character.isDigit(currentChar)) {
				
				numCount++;
			
			}

		}

		if ((charCount == 3) && (numCount == 3)) {

			return true;

		}

		return false;
	
	}

}
