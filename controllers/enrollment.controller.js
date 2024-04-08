import Enrollment from '../models/enrollment.model.js';
import Course from '../models/course.model.js';
import morgan from 'morgan';
import { sendEnrollmentEmail } from '../utils/emailService.js';


/**
 * Enrolls a user in a course, sends enrollment email, and handles errors.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @return {Promise<void>} a Promise that resolves when the enrollment is completed
 */
export const enrollCourse = async (req, res) => {
  morgan('dev')(req, res, async () => {
    const { courseId } = req.params;
    const userId = req.user._id;

    try {
      // Check if the user is already enrolled in the course
      const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
      if (existingEnrollment) {
        return res.status(400).json({ error: 'You are already enrolled in this course' });
      }

      // Create a new enrollment
      const enrollment = new Enrollment({ user: userId, course: courseId });
      await enrollment.save();

       // Get the course name
      const course = await Course.findById(courseId);
      await sendEnrollmentEmail(req.user.email, course.title);
      res.status(201).json({ message: 'Enrolled in the course successfully' });
    } catch (err) {
      console.error('Error in enrollCourse:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};


/**
 * Retrieves the courses that a user is enrolled in and sends the list as a JSON response.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @return {Promise<void>} a Promise that resolves to sending a JSON response with the enrolled courses
 */
export const getEnrolledCourses = async (req, res) => {
  morgan('dev')(req, res, async () => {
    const userId = req.user._id;

    try {
      const enrollments = await Enrollment.find({ user: userId }).populate('course');
      const courses = enrollments.map(enrollment => enrollment.course);
      res.json(courses);
    } catch (err) {
      console.error('Error in getEnrolledCourses:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};