/**
 * Handles validation errors thrown by Mongoose.
 * @param {Error} err - The validation error object.
 * @returns {Object} An object containing status code, message, and error messages.
 */
const handleValidationError = err => {
  const errors = Object.values(err.errors).map(el => {
    return {
      path: el?.path,
      message: el?.message,
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation Error',
    errorMessages: errors,
  };
};

export default handleValidationError;
