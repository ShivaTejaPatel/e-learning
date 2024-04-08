import express from "express";
const router = express.Router();
import { enrollCourse, getEnrolledCourses } from "../controllers/enrollment.controller.js";
import { verifyToken } from  "../utils/verifyUser.js";


router.post("/:courseId", verifyToken, enrollCourse);

// Get enrolled courses for the authenticated user 
router.get("/", verifyToken, getEnrolledCourses);

export default router;
