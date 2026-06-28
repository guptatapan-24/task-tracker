/**
 * Centralized error-handling middleware.
 * Catches all errors passed via next(error) and returns a structured JSON response.
 * In production, stack traces are stripped to prevent information leakage.
 */
const errorHandler = (err, req, res, next) => {
  // Log the full error for server-side debugging
  console.error(`[Error] ${err.message}`);

  // Mongoose validation error (e.g. from schema validators)
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // Mongoose bad ObjectId / cast error
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(', ');
    return res.status(400).json({
      success: false,
      message: `Duplicate value for field: ${field}`,
    });
  }

  // Default: internal server error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
