const mongoose = require('mongoose');
const Task = require('../models/Task');

/**
 * GET /api/tasks
 * List all tasks with optional filtering, search, and sorting.
 * Query params:
 *   status   - filter by status (todo, in-progress, done)
 *   priority - filter by priority (low, medium, high)
 *   search   - case-insensitive search on title
 *   sort     - sort field: dueDate, -dueDate, priority, -priority, createdAt, -createdAt
 */
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, sort } = req.query;
    const filter = {};

    // Filter by status
    if (status && ['todo', 'in-progress', 'done'].includes(status)) {
      filter.status = status;
    }

    // Filter by priority
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      filter.priority = priority;
    }

    // Search by title (case-insensitive partial match)
    if (search && search.trim()) {
      filter.title = { $regex: search.trim(), $options: 'i' };
    }

    // Build sort object — prefix with "-" for descending
    let sortObj = { createdAt: -1 }; // default: newest first
    if (sort) {
      const priorityOrder = { high: 3, medium: 2, low: 1 };

      if (sort === 'dueDate') sortObj = { dueDate: 1 };
      else if (sort === '-dueDate') sortObj = { dueDate: -1 };
      else if (sort === 'priority') sortObj = { priority: 1 };
      else if (sort === '-priority') sortObj = { priority: -1 };
      else if (sort === 'createdAt') sortObj = { createdAt: 1 };
      else if (sort === '-createdAt') sortObj = { createdAt: -1 };
    }

    const tasks = await Task.find(filter).sort(sortObj);
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tasks/:id
 * Get a single task by ID.
 */
const getTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tasks
 * Create a new task. Body is pre-validated by Joi middleware.
 */
const createTask = async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/tasks/:id
 * Update a task. Body is pre-validated by Joi middleware.
 */
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const task = await Task.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run Mongoose schema validators on update
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/tasks/:id
 * Delete a task by ID.
 */
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({ success: true, message: 'Task deleted', data: task });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
