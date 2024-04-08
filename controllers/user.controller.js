import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import morgan from 'morgan';

import { sendPasswordUpdatedEmail } from '../utils/emailService.js'; 

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
export const deleteUser = async (req, res, next) => {
  morgan('dev')(req, res, async () => {
    if (req.user.id !== req.params.id)
      return next(errorHandler(403, "You can delete only your account"));

    try {
      await User.findByIdAndDelete(req.params.id);
      res.clearCookie("access_token");
      res.status(200).json("User has been deleted");
    } catch (error) {
      console.error('Error in deleteUser:', error);
      next(error);
    }
  });
};

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