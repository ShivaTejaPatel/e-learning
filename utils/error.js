/**
 * Creates and returns an error object with the specified statusCode and message.
 *
 * @param {number} statusCode - The status code for the error.
 * @param {string} message - The error message.
 * @return {Error} The error object with statusCode and message.
 */
export const errorHandler = (statusCode, message) => {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    return error;
};