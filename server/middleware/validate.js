const Joi = require('joi');

/**
 * Joi schema for creating a new task.
 * Title is required; all other fields have defaults in the Mongoose model.
 */
const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'Title is required',
    'string.max': 'Title cannot exceed 100 characters',
    'any.required': 'Title is required',
  }),
  description: Joi.string().trim().max(500).allow('').optional().messages({
    'string.max': 'Description cannot exceed 500 characters',
  }),
  status: Joi.string().valid('todo', 'in-progress', 'done').optional().messages({
    'any.only': 'Status must be one of: todo, in-progress, done',
  }),
  priority: Joi.string().valid('low', 'medium', 'high').optional().messages({
    'any.only': 'Priority must be one of: low, medium, high',
  }),
  dueDate: Joi.date().iso().allow(null).optional().messages({
    'date.format': 'Due date must be a valid ISO date',
  }),
});

/**
 * Joi schema for updating a task.
 * Same rules as create but nothing is required — partial updates allowed.
 */
const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).optional().messages({
    'string.empty': 'Title cannot be empty',
    'string.max': 'Title cannot exceed 100 characters',
  }),
  description: Joi.string().trim().max(500).allow('').optional().messages({
    'string.max': 'Description cannot exceed 500 characters',
  }),
  status: Joi.string().valid('todo', 'in-progress', 'done').optional().messages({
    'any.only': 'Status must be one of: todo, in-progress, done',
  }),
  priority: Joi.string().valid('low', 'medium', 'high').optional().messages({
    'any.only': 'Priority must be one of: low, medium, high',
  }),
  dueDate: Joi.date().iso().allow(null).optional().messages({
    'date.format': 'Due date must be a valid ISO date',
  }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

/**
 * Express middleware factory that validates req.body against the given Joi schema.
 * Returns 400 with structured error messages on validation failure.
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Collect all errors
      stripUnknown: true, // Remove fields not in schema
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    // Replace body with validated/sanitized value
    req.body = value;
    next();
  };
};

module.exports = { validate, createTaskSchema, updateTaskSchema };
