package StudentRegistry;

import java.util.Arrays;
import java.util.List;
import java.util.TreeMap;

// Course Class Scheduler

public class Scheduler {

	TreeMap<Integer, String> monday    = new TreeMap<Integer, String>();
	TreeMap<Integer, String> tuesday   = new TreeMap<Integer, String>();
	TreeMap<Integer, String> wednesday = new TreeMap<Integer, String>();
	TreeMap<Integer, String> thursday  = new TreeMap<Integer, String>();
	TreeMap<Integer, String> friday    = new TreeMap<Integer, String>();
	TreeMap<String, ActiveCourse> courses;

	/**
	 * Initializes schedule TreeMap.
	 * 
	 * @param courseList - Courses TreeMap
	 */
	public Scheduler(TreeMap<String, ActiveCourse> courseList) {

		this.courses = new TreeMap<String, ActiveCourse>(courseList);
		initializeFullSchedule();

	}

	/**
	 * Initializes the whole weeks schedule.
	 */
	private void initializeFullSchedule() {

		for (int time = 800; time < 1800; time += 100) {

			monday.put(time, "");
			tuesday.put(time, "");
			wednesday.put(time, "");
			thursday.put(time, "");
			friday.put(time, "");

		}

	}

	/**
	 * Sets, for a given coursecode, the day, start time and duration.
	 * 
	 * @param courseCode - Course Code
	 * @param day        - Day Of The Week
	 * @param startTime  - Start Time Between 8 AM and 5 PM
	 * @param duration   - Lecture Duration
	 * 
	 * @throws InvalidDayException           - If Invalid Day Entered
	 * @throws InvalidTimeException          - If Time Is Before Or After Time Limits
	 * @throws InvalidDurationException      - If Duration Exceeds 3 hours
	 * @throws LectureTimeCollisionException - If Lecture Time Collides With Another Lecture
	 */
	public void setDayAndTime(String courseCode, String day, int startTime, int duration)
			throws InvalidDayException, InvalidTimeException, InvalidDurationException, LectureTimeCollisionException {
				
		int endTime = startTime + ((duration - 1) * 100);
		
		final List<String> week = Arrays.asList("mon", "tue", "wed", "thur", "fri");
		
		if (!courses.containsKey(courseCode)) {

			System.out.println("Unknown course: " + courseCode);
			return;
		
		} else if (!(courses.get(courseCode).getDay()).equals("")) {

			System.out.println("Class is already scheduled!\nConsider clearing its schedule before rescheduling.");
			return;

		} else if (!week.contains(day)) {
		
			throw new InvalidDayException("Invalid lecture day: " + day);
		
		} else if (startTime < 800 || startTime > 1700) {
		
			throw new InvalidTimeException("Invalid lecture start time: " + startTime);
		
		} else if (endTime > 1700) {
		
			throw new InvalidTimeException("Lecture end time exceeds time limit (1800): " + endTime);
		
		} else if (duration < 1 || duration > 3) {
		
			throw new InvalidDurationException("Invalid lecture duration: " + duration);
		
		}

		for (ActiveCourse course : courses.values()) {

			if (course.getDay().equals(day)) {

				if ((startTime >= course.getStartTime() && startTime <= course.getEndTime()) ||
					(endTime   >= course.getStartTime() && endTime   <= course.getEndTime())) {

					throw new LectureTimeCollisionException("Lecture time collision with course: " + course.getCode());
				
				}

			}
		
		}
		
		ActiveCourse courseObj = courses.get(courseCode);

		courseObj.setDay(day);
		courseObj.setStart(startTime);
		courseObj.setDuration(duration);
		setCourseSchedule(courseCode, day, startTime, duration);

	}

	/**
	 * Clears schedule for a specified course code.
	 * 
	 * @param courseCode - Course Code
	 */
	public void clearSchedule(String courseCode) {
		
		ActiveCourse course = courses.get(courseCode);

		if (!courses.containsKey(courseCode)) {
		
			System.out.println("Unknown course: " + courseCode);
			return;
		
		}

		clearCourseSchedule(courseCode, course.getDay(), course.getStartTime());
		course.resetSchedule();

	}

	/**
	 * Adds course to schedule.
	 * 
	 * @param courseCode    - Course code
	 * @param day			- Day of week
	 * @param startTime		- Start time for class
	 * @param duration		- Duration of class
	 */
	private void setCourseSchedule(String courseCode, String day, int startTime, int duration) {

		courseCode = courseCode.toUpperCase();

		switch (day) {

			case "mon":

				for (int count = 0; count < duration; count++) {

					monday.put(startTime + (100 * count), courseCode);
				
				}

				break;
			
			case "tue":
				
				for (int count = 0; count < duration; count++) {

					tuesday.put(startTime + (100 * count), courseCode);
				
				}


				break;

			case "wed":
				
				for (int count = 0; count < duration; count++) {

					wednesday.put(startTime + (100 * count), courseCode);
				
				}

				break;
	
			case "thur":
			
				for (int count = 0; count < duration; count++) {

					thursday.put(startTime + (100 * count), courseCode);
				
				}

				break;
			
			case "fri":
				
				for (int count = 0; count < duration; count++) {

					friday.put(startTime + (100 * count), courseCode);
				
				}

				break;

			default:
				
				break;
		
		}

	}

	/**
	 * Clears course from schedule.
	 * 
	 * @param courseCode - Course code
	 * @param day		 - Day of week
	 * @param startTime	 - Start time for class
	 * 
	 */
	private void clearCourseSchedule(String courseCode, String day, int startTime) {
		
		int time = startTime;
		courseCode = courseCode.toUpperCase();

		switch (day) {

			case "mon":

				while ((monday.get(time) != null) && (monday.get(time)).equals(courseCode)) {

					monday.put(time, "");
					time += 100;

				}

				break;
			
			case "tue":
				
				while ((tuesday.get(time) != null) && (tuesday.get(time)).equals(courseCode)) {

					tuesday.put(time, "");
					time += 100;

				}


				break;

			case "wed":
				
				while ((wednesday.get(time) != null) && (wednesday.get(time)).equals(courseCode)) {

					wednesday.put(time, "");
					time += 100;

				}

				break;
	
			case "thur":
			
				while ((thursday.get(time) != null) && (thursday.get(time)).equals(courseCode)) {

					thursday.put(time, "");
					time += 100;

				}

				break;
			
			case "fri":

				while ((friday.get(time) != null) && (friday.get(time)).equals(courseCode)) {

					friday.put(time, "");
					time += 100;

				}

				break;

			default:
				
				break;
		
		}
		
	}

	/**
	 * Prints schedule for the week.
	 */
	public void printSchedule() {

		System.out.println("\n____________________________________________________");
		System.out.print("|");
		System.out.printf("%12s", "Monday");
		System.out.printf("%9s", "Tuesday");
		System.out.printf("%11s", "Wednesday");
		System.out.printf("%10s", "Thursday");
		System.out.printf("%8s", "Friday");
		System.out.print("|\n");
		System.out.println("|--------------------------------------------------|");
		
		for (int i = 800; i < 1800; i += 100) {
		
			System.out.print("|");
			System.out.printf("%04d", i);
			System.out.print(" ");
			System.out.printf("%7s", monday.get(i));
			System.out.printf("%8s", tuesday.get(i));
			System.out.printf("%10s", wednesday.get(i));
			System.out.printf("%11s", thursday.get(i));
			System.out.printf("%9s", friday.get(i));
			System.out.print("|\n");
		
		}
		
		System.out.println("|__________________________________________________|\n");
	
	}

}
