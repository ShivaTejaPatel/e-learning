import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import morgan from 'morgan';

export const updateUser = async (req, res, next) => {
  morgan('dev')(req, res, async () => {
    if (req.user.id !== req.params.id)
      return next(errorHandler(403, "You can update only your account"));

    try {
      if (req.body.password) {
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            avatar: req.body.avatar,
          },
        },
        { new: true }
      );

      const { password, ...rest } = updatedUser._doc;
      res.status(200).json(rest);
    } catch (error) {
      console.error('Error in updateUser:', error);
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