import Course from '../models/course.model.js';
import morgan from 'morgan';


/**
 * Get all courses based on specified filters and pagination options.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise} A promise that resolves with the JSON response of courses or rejects with an error.
 */
export const getAllCourses = async (req, res) => {
  morgan('dev')(req, res, async () => {
    const { category, level, page = 1, limit = 10 } = req.query;

    const filters = {};
    if (category) filters.category = category;
    if (level) filters.level = level;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };

    try {
      const courses = await Course.paginate(filters, options);
      res.json(courses);
    } catch (err) {
      console.error('Error in getAllCourses:', err);
      if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};

/**
 * Asynchronous function for creating a course.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {Promise} A promise that resolves to the created course or rejects with an error
 */
export const createCourse = async (req, res) => {
  morgan('dev')(req, res, async () => {
    const { title, description, category, level } = req.body;

    try {
      const course = new Course({ title, description, category, level });
      await course.save();
      res.status(201).json(course);
    } catch (err) {
      res.status(400).json({ error: 'Failed to create course' });
    }
  });
};


/**
 * Retrieves a course by its ID asynchronously.
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @return {Promise<void>} JSON response with the course data or an error message
 */
export const getCourseById = async (req, res) => {
  morgan('dev')(req, res, async () => {
    const { id } = req.params;
    try {
      const course = await Course.findById(id);
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
      res.json(course);
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};


/**
 * Update a course in the database based on the provided ID and updates.
 *
 * @param {Object} req - The request object containing parameters and body data.
 * @param {Object} res - The response object to send back the result.
 * @return {Promise<void>} A Promise that resolves once the course is updated or an error occurs.
 */
export const updateCourse = async (req, res) => {
  morgan('dev')(req, res, async () => {
    const { id } = req.params;
    const updates = req.body;

    try {
      const course = await Course.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      res.json(course);
    } catch (err) {
      console.error('Error in updateCourse:', err);
      if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
      }
      res.status(400).json({ error: 'Failed to update course' });
    }
  });
};


/**
 * Asynchronously deletes a course.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @return {Promise<void>} a promise that resolves when the course is deleted or rejects with an error
 */
export const deleteCourse = async (req, res) => {
  morgan('dev')(req, res, async () => {
    const { id } = req.params;

    try {
      const course = await Course.findByIdAndDelete(id);
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
      res.json({ message: 'Course deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};