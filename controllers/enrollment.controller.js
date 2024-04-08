import Enrollment from '../models/enrollment.model.js';
import Course from '../models/course.model.js';
import morgan from 'morgan';
import { sendEnrollmentEmail } from '../utils/emailService.js';

// Enroll in a course
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

// Get enrolled courses for the authenticated user
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