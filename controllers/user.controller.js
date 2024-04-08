import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import morgan from 'morgan';
import Enrollment from '../models/enrollment.model.js';

import { sendPasswordUpdatedEmail } from '../utils/emailService.js'; 

/**
 * Update a user's information if they are authenticated to do so.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @return {Promise<void>} Promise that resolves once the user is updated
 */
export const updateUser = async (req, res, next) => {
  morgan('dev')(req, res, async () => {
    try {
      // Check if the authenticated user is trying to update their own account
      if (req.user.id !== req.params.id) {
        return next(errorHandler(403, "You can update only your account"));
      }

      // Update the user's information
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            avatar: req.body.avatar,
          },
        },
        { new: true, runValidators: true }
      );

      // Remove the password field from the response
      const { password, ...rest } = updatedUser.toObject();
      res.status(200).json(rest);
    } catch (error) {
      console.error('Error in updateUser:', error);
      next(error);
    }
  });
};

/**
 * Update user password and send email notification.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - the next function
 * @return {Promise<void>} a promise that resolves when the password is updated
 */
export const updatePassword = async (req, res, next) => {
  morgan('dev')(req, res, async () => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return next(errorHandler(404, "User not found"));

      user.password = bcryptjs.hashSync(req.body.newPassword, 10);
      await user.save();

      // Send password updated email using Resend
      await sendPasswordUpdatedEmail(user.email, user.name);

      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error in updatePassword:', error);
      next(error);
    }
  });
};



/**
 * Delete a user, along with their enrollments, and clear their access token cookie.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @return {Promise<void>} A promise that resolves when the user is deleted
 */
export const deleteUser = async (req, res, next) => {
  morgan('dev')(req, res, async () => {
    try {
      // Check if the authenticated user is trying to delete their own account
      if (req.user.id !== req.params.id) {
        return next(errorHandler(403, "You can delete only your account"));
      }

      // Delete the user's enrollments
      await Enrollment.deleteMany({ user: req.params.id });

      // Delete the user
      await User.findByIdAndDelete(req.params.id);

      // Clear the user's access token cookie
      res.clearCookie("access_token");

      res.status(200).json({ message: "User has been deleted" });
    } catch (error) {
      console.error('Error in deleteUser:', error);
      next(error);
    }
  });
};

/**
 * Function to get a user by ID asynchronously.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function.
 * @return {Promise} Promise that resolves to the user data or an error.
 */
export const getUser = async (req, res, next) => {
  morgan('dev')(req, res, async () => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return next(errorHandler(404, 'User not found!'));

      const { password: pass, ...rest } = user._doc;
      res.status(200).json(rest);
    } catch (error) {
      console.error('Error in getUser:', error);
      next(error);
    }
  });
};