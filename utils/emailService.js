import { Resend } from 'resend';
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sets up the sender email by creating an email using the resend service.
 *
 * @return {Promise<void>} Promise that resolves once the sender email is set up successfully
 */
export const setupSenderEmail = async () => {
  try {
    await resend.emails.create({
      email: 'hello@nstinfo.xyz',
      domain: 'nstinfo.xyz',
    });
    console.log('Sender email set up successfully!');
  } catch (error) {
    console.error('Error setting up sender email:', error.message);
  }
};

/**
 * Sends a registration email to the specified email address with the user's name.
 *
 * @param {string} email - the email address to send the registration email to
 * @param {string} name - the name of the user registering
 * @return {Promise} a promise that resolves when the email is successfully sent, or rejects with an error
 */
export const sendRegistrationEmail = async (email, name) => {
  try {
    await resend.emails.send({
      from: 'hello@nstinfo.xyz',
      to: email,
      subject: 'Welcome to our e-learning platform!',
      html: `<p>Hello, ${name}!</p><p>Thank you for registering with our e-learning platform. We're excited to have you on board.</p>`,
    });
  } catch (error) {
    console.error('Error sending registration email:', error);
  }
};

/**
 * Sends an enrollment email to the specified email address for the given course.
 *
 * @param {string} email - The email address to send the enrollment email to.
 * @param {string} courseName - The name of the course the user enrolled in.
 * @return {Promise<void>} A promise that resolves when the email is sent successfully.
 */
export const sendEnrollmentEmail = async (email, courseName) => {
  try {
    await resend.emails.send({
      from: 'hello@nstinfo.xyz',
      to: email,
      subject: `You've enrolled in a new course!`,
      html: `<p>You have successfully enrolled in the course: ${courseName}.</p>`,
    });
  } catch (error) {
    console.error('Error sending enrollment email:', error);
  }
};


/**
 * Sends a password updated email to the specified email address.
 *
 * @param {string} email - The email address to send the password updated email to.
 * @param {string} name - The name of the user.
 * @return {Promise<void>} A promise that resolves when the email is sent successfully.
 */
export const sendPasswordUpdatedEmail = async (email, name) => {
  try {
    await resend.emails.send({
      from: 'hello@nstinfo.xyz',
      to: email,
      subject: 'Password Updated',
      html: `
        <p>Hello, ${name}!</p>
        <p>Your password has been successfully updated for our e-learning platform.</p>
        <p>If you did not request this password update, please contact our support team.</p>
      `,
    });
  } catch (error) {
    console.error('Error sending password updated email:', error);
  }
};