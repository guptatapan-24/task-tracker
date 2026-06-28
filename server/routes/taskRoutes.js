const express = require('express');
const router = express.Router();
const { getTasks, getTask } = require('../controllers/taskController');

// GET /api/tasks - list all tasks
router.get('/', getTasks);

// GET /api/tasks/:id - get single task
router.get('/:id', getTask);

module.exports = router;
