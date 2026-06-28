import { useState, useEffect } from 'react';
import { Button, Input } from './ui';
import './TaskForm.css';

const INITIAL_STATE = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
};

/**
 * Validates task form fields. Returns an object of field -> error message.
 * Mirrors server-side Joi validation rules.
 */
function validateForm(values) {
  const errors = {};

  if (!values.title.trim()) {
    errors.title = 'Title is required';
  } else if (values.title.length > 100) {
    errors.title = 'Title cannot exceed 100 characters';
  }

  if (values.description.length > 500) {
    errors.description = 'Description cannot exceed 500 characters';
  }

  if (!['todo', 'in-progress', 'done'].includes(values.status)) {
    errors.status = 'Invalid status';
  }

  if (!['low', 'medium', 'high'].includes(values.priority)) {
    errors.priority = 'Invalid priority';
  }

  if (values.dueDate) {
    const date = new Date(values.dueDate);
    if (isNaN(date.getTime())) {
      errors.dueDate = 'Invalid date';
    }
  }

  return errors;
}

/**
 * TaskForm — create or edit a task.
 * When `task` prop is provided, populates form for editing.
 */
function TaskForm({ task, onSubmit, onCancel, loading = false }) {
  const [values, setValues] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const isEditing = Boolean(task);

  // Populate form when editing an existing task
  useEffect(() => {
    if (task) {
      setValues({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      });
      setErrors({});
      setTouched({});
    } else {
      setValues(INITIAL_STATE);
      setErrors({});
      setTouched({});
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    // Validate field on change if already touched
    if (touched[name]) {
      const newValues = { ...values, [name]: value };
      const newErrors = validateForm(newValues);
      setErrors((prev) => ({
        ...prev,
        [name]: newErrors[name] || undefined,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate on blur
    const newErrors = validateForm(values);
    setErrors((prev) => ({
      ...prev,
      [name]: newErrors[name] || undefined,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(values);
    setErrors(validationErrors);
    setTouched({ title: true, description: true, status: true, priority: true, dueDate: true });

    if (Object.keys(validationErrors).length > 0) return;

    // Build payload — send dueDate as null if empty
    const payload = {
      ...values,
      dueDate: values.dueDate || null,
    };

    onSubmit(payload);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <Input
        id="task-title"
        name="title"
        label="Title *"
        placeholder="What needs to be done?"
        value={values.title}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.title && errors.title}
        maxLength={100}
      />

      <Input
        id="task-description"
        name="description"
        label="Description"
        as="textarea"
        placeholder="Add some details..."
        value={values.description}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.description && errors.description}
        maxLength={500}
      />

      <div className="task-form__row">
        <Input
          id="task-status"
          name="status"
          label="Status"
          as="select"
          value={values.status}
          onChange={handleChange}
          error={touched.status && errors.status}
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </Input>

        <Input
          id="task-priority"
          name="priority"
          label="Priority"
          as="select"
          value={values.priority}
          onChange={handleChange}
          error={touched.priority && errors.priority}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Input>
      </div>

      <Input
        id="task-due-date"
        name="dueDate"
        label="Due Date"
        type="date"
        value={values.dueDate}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.dueDate && errors.dueDate}
      />

      <div className="task-form__actions">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {isEditing ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}

export default TaskForm;
