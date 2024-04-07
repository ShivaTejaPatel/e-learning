import express from "express";
const router = express.Router();
import { enrollCourse, getEnrolledCourses } from "../controllers/enrollment.controller.js";
import { isAuthenticated } from  "../middleware/auth";

// Enroll in a course
router.post("/:courseId", isAuthenticated, enrollCourse);

// Get enrolled courses for the authenticated user
router.get("/", isAuthenticated, getEnrolledCourses);

export default router;
