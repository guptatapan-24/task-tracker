const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
} = require('../controllers/taskController');
const { validate, createTaskSchema } = require('../middleware/validate');

// GET /api/tasks - list all tasks
router.get('/', getTasks);

// GET /api/tasks/:id - get single task
router.get('/:id', getTask);

// POST /api/tasks - create new task
router.post('/', validate(createTaskSchema), createTask);

module.exports = router;

