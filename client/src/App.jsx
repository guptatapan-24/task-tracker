import { useState, useEffect, useCallback } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './services/api';
import { useToast } from './context/ToastContext';
import { Modal, Button, Spinner } from './components/ui';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();

  // Fetch tasks from API
  const fetchTasks = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTasks(params);
      setTasks(response.data);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch tasks';
      setError(message);
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // Initial fetch on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create a new task
  const handleCreate = async (taskData) => {
    try {
      setSubmitting(true);
      await createTask(taskData);
      addToast('Task created successfully!', 'success');
      setIsModalOpen(false);
      fetchTasks();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create task';
      addToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Update an existing task
  const handleUpdate = async (taskData) => {
    try {
      setSubmitting(true);
      await updateTask(editingTask._id, taskData);
      addToast('Task updated successfully!', 'success');
      setIsModalOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update task';
      addToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete a task
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(id);
      addToast('Task deleted', 'success');
      fetchTasks();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete task';
      addToast(message, 'error');
    }
  };

  // Open modal for editing
  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Open modal for creating
  const handleOpenCreate = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__header-content">
          <div className="app__brand">
            <div className="app__logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#logo-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                  <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </div>
            <h1 className="app__title">TaskTracker</h1>
          </div>
          <Button variant="primary" onClick={handleOpenCreate}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Task
          </Button>
        </div>
      </header>

      <main className="app__main">
        {/* FilterBar will be added in commit 22 */}

        {loading ? (
          <Spinner size="lg" />
        ) : error ? (
          <div className="app__error">
            <p>{error}</p>
            <Button variant="secondary" onClick={() => fetchTasks()}>
              Try Again
            </Button>
          </div>
        ) : (
          <TaskList tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </main>

      {/* Task create/edit modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
      >
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdate : handleCreate}
          onCancel={handleCloseModal}
          loading={submitting}
        />
      </Modal>
    </div>
  );
}

export default App;
