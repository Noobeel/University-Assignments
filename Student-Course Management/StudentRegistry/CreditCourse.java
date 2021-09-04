package StudentRegistry;

// Credit Courses (Student Enrolled Course)

public class CreditCourse extends Course {

	private String  semester;
	private boolean active;
	private double  grade = 0;

	/**
	 * Constructor Method: Initializes instance variables.
	 * 
	 * @param name        - Course Name
	 * @param code     	  - Course Code
	 * @param description - Course Description
	 * @param format      - Course Format
	 * @param semester    - Current Semester
	 * @param grade       - Grade of student taking course
	 */
	public CreditCourse(String name, String code, String description, String format, String semester, double grade) {

		super(name, code, description, format);
		
		this.semester = semester;
		this.grade    = grade;
		this.active   = true;

	}

	/**
	 * @return Current Semester
	 */
	public String getSemester() {

		return this.semester;

	}

	/**
	 * @return Current Grade
	 */
	public double getGrade() {

		return this.grade;

	}

	/**
	 * @return Course Active Status
	 */
	public boolean getActive() {

		return this.active;

	}

	/**
	 * Sets current grade.
	 * 
	 * @param grade Grade Value
	 */
	public void setGrade(double grade) {

		this.grade = grade;

	}

	/**
	 * Sets active status to true.
	 */
	public void setActive() {

		this.active = true;

	}

	/**
	 * Sets active status to false.
	 */
	public void setInactive() {

		this.active = false;

	}

	/**
	 * @return Course info along with current semester and grade achieved.
	 */
	public String displayGrade() {

		return super.getDescription() +
			   "Semester: " + this.semester + "\n" + 
			   "Grade Achieved: " + convertNumericGrade(this.grade) + "\n";

	}

}
