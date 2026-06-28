import axios from 'axios';

/**
 * Axios instance configured with the backend API base URL.
 * The URL is read from VITE_API_URL env var (no trailing slash).
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch all tasks with optional query params for filtering, search, and sort.
 * @param {Object} params - { status, priority, search, sort }
 */
export const getTasks = async (params = {}) => {
  // Remove empty/undefined params before sending
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null)
  );
  const { data } = await api.get('/tasks', { params: cleanParams });
  return data;
};

/**
 * Fetch a single task by ID.
 */
export const getTask = async (id) => {
  const { data } = await api.get(`/tasks/${id}`);
  return data;
};

/**
 * Create a new task.
 * @param {Object} taskData - { title, description, status, priority, dueDate }
 */
export const createTask = async (taskData) => {
  const { data } = await api.post('/tasks', taskData);
  return data;
};

/**
 * Update an existing task.
 * @param {string} id - Task ID
 * @param {Object} taskData - Fields to update
 */
export const updateTask = async (id, taskData) => {
  const { data } = await api.put(`/tasks/${id}`, taskData);
  return data;
};

/**
 * Delete a task by ID.
 */
export const deleteTask = async (id) => {
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
};

export default api;
