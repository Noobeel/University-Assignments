package StudentRegistry;

// Course Superclass

public class Course {

	private String code;
	private String name;
	private String description;
	private String format;

	/**
	 * Constructor Method: Initializes instance variables to given parameters.
	 * 
	 * @param name  - Course Name
	 * @param code  - Course Code
	 * @param descr - Course Description
	 * @param fmt   - Course Format
	 */
	public Course(String name, String code, String description, String format) {
		
		this.code 		 = code;
		this.name 		 = name;
		this.description = description;
		this.format 	 = format;

	}

	/**
	 * @return Course Code
	 */
	public String getCode() {

		return this.code;

	}

	/**
	 * @return Course Name
	 */
	public String getName() {

		return this.name;

	}

	/**
	 * @return Course Format
	 */
	public String getFormat() {

		return this.format;

	}

	/**
	 * @return Course Description
	 */
	public String getDescription() {

		return "Course Information:\n" +
			   "Code: " + this.code + "\n" +
			   "Name: " + this.name + "\n" +
			   "Description:" + this.description + "\n" +
			   "Format: " + this.format + "\n";

	}

	/**
	 * Converts given score to letter grade.
	 * 
	 * @param score - Given Score
	 * @return Letter Grade
	 */
	public static String convertNumericGrade(double score) {

		if (score < 50 && score >= 0) {

			return "F";

		} else if (score < 53 && score >= 50) {

			return "D-";

		} else if (score < 57 && score >= 53) {

			return "D";

		} else if (score < 60 && score >= 57) {

			return "D+";

		} else if (score < 63 && score >= 60) {

			return "C-";

		} else if (score < 67 && score >= 63) {

			return "C";

		} else if (score < 70 && score >= 67) {

			return "C+";

		} else if (score < 73 && score >= 70) {

			return "B-";

		} else if (score < 77 && score >= 73) {

			return "B";

		} else if (score < 80 && score >= 77) {

			return "B+";

		} else if (score < 85 && score >= 80) {

			return "A-";

		} else if (score < 90 && score >= 85) {

			return "A";

		}

		return "A+";

	}

}
