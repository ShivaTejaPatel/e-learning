
import { errorHandler } from './error.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'; 

/**
 * Verifies the token from the request cookies, checks if the user exists in the database, and sets req.user if valid.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function
 * @return {void}
 */
export const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, 'Not Authorized'));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id); 

    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    req.user = user; 
    next();
  } catch (error) {
    return next(errorHandler(403, 'Forbidden'));
  }
};

/**
 * Checks if the user is a superadmin and calls the next middleware.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @return {void}
 */
export const isSuperadmin = (req, res, next) => {
  const user = req.user;

  if (!user || !user.isSuperadmin) {
    return next(errorHandler(403, 'Forbidden: Not a superadmin'));
  }

  next();
};
