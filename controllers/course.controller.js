/*import Course from '../models/course.model.js';

// Get all courses with filtering and pagination
export const getAllCourses = async (req, res) => {
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
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new course
export const createCourse = async (req, res) => {
  const { title, description, category, level } = req.body;

  try {
    const course = new Course({ title, description, category, level });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create course' });
  }
};

// Get a specific course
export const getCourseById = async (req, res) => {
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
};

// Update a course
export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, level } = req.body;

  try {
    const course = await Course.findByIdAndUpdate(
      id,
      { title, description, category, level },
      { new: true }
    );
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update course' });
  }
};

// Delete a course
export const deleteCourse = async (req, res) => {
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
};*/

import Course from '../models/course.model.js';
import morgan from 'morgan';

// Get all courses with filtering and pagination
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
// Create a new course
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

// Get a specific course
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

// Update a course
export const updateCourse = async (req, res) => {
  morgan('dev')(req, res, async () => {
    const { id } = req.params;
    const { title, description, category, level } = req.body;

    try {
      const course = await Course.findByIdAndUpdate(
        id,
        { title, description, category, level },
        { new: true }
      );
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
      res.json(course);
    } catch (err) {
      res.status(400).json({ error: 'Failed to update course' });
    }
  });
};

// Delete a course
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