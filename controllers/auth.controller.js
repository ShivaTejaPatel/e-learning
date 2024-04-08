import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';
import morgan from 'morgan';
import { sendRegistrationEmail } from "../utils/emailService.js";

/**
 * Asynchronous function for user signup.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - the next function
 * @return {Promise} a Promise that resolves to the created user data or rejects with an error
 */
export const signup = async (req, res, next) => {
  morgan('dev')(req, res, async () => {
    const { name, email, password, avatar, isSuperadmin } = req.body;

    const hashedPassword = bcryptjs.hashSync(password, 10);

    try {
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        avatar: avatar,
        isSuperadmin: isSuperadmin || false,
      });
      await sendRegistrationEmail(email, name);
      console.log(newUser);
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      next(error);
    }
  });
};

/**
 * Function for user sign in.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - the next function
 * @return {Promise<void>}
 */
export const signin = async(req, res, next) => {
  morgan('dev')(req, res, async () => {
    const {email, password} = req.body;

    try{
      const validUser = await User.findOne({email});
      if(!validUser) return next(errorHandler(404,"User not found"));

      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if(!validPassword) return next(errorHandler(404,'wrong credentials'));

      const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
      const {password: pass, ...rest} = validUser._doc;

      res
        .cookie('access_token', token, {httpOnly: true})
        .status(200)
        .json(rest);
    }
    catch(error) {
      next(error);
    }
  });
};

/**
 * A function that signs out the user by clearing the access token cookie and responding with a success message.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function in the middleware chain
 * @return {Promise} A promise that resolves once the user is signed out
 */
export const signout = async (req, res, next) => {
  morgan('dev')(req, res, async () => {
    try{
      res.clearCookie("access_token");
      res.status(200).json("User has been signed out");
    }
    catch(error) {
      next(error);
    }
  });
};