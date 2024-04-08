import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import courseRouter from "./routes/course.route.js";
import userRouter from "./routes/user.route.js";
import enrollRouter from "./routes/enrollement.route.js";
import morgan from "morgan";
import { setupSenderEmail } from "./utils/emailService.js";
import express from "express";
import cookieParser from "cookie-parser";


const app = express();

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    setupSenderEmail(); // Call the setupSenderEmail function
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });


app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());



// Define your routes before error handling middleware
app.use('/api/auth', authRouter);
app.use('/api/course',courseRouter);
app.use('/api/user',userRouter);
app.use('/api/enroll',enrollRouter);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
 
});
