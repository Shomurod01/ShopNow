// global error handler - catches all errors passed to next(err)
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  console.error('Error:', err.message);

  // handle bad mongo IDs
  if (err.name === 'CastError') {
    message = `Resource not found with id ${err.value}`;
    statusCode = 404;
  }

  // duplicate field in db (like duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const capitalized = field.charAt(0).toUpperCase() + field.slice(1);
    message = `${capitalized} already exists`;
    statusCode = 400;
  }

  // mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    message = messages.join(', ');
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
