import express from 'express';
const router = express.Router();
import { getAllCourses, createCourse, getCourseById, updateCourse, deleteCourse} from '../controllers/course.controller.js';
import { verifyToken, isSuperadmin }  from '../utils/verifyUser.js';

// Get all courses (with filtering and pagination)
router.get('/', getAllCourses);

// Create a new course (only for superadmin)
router.post('/', verifyToken, isSuperadmin, createCourse);

// Get a specific course
router.get('/:id', getCourseById);

// Update a course (only for superadmin)
router.put('/:id', verifyToken, isSuperadmin, updateCourse);

// Delete a course (only for superadmin)
router.delete('/:id', verifyToken, isSuperadmin, deleteCourse);

export default  router;