import TaskCard from './TaskCard';
import './TaskList.css';

/**
 * TaskList — renders a grid of TaskCard components.
 * Shows an empty state message when no tasks are available.
 */
function TaskList({ tasks, onEdit, onDelete }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="task-list__empty">
        <div className="task-list__empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
        </div>
        <h3 className="task-list__empty-title">No tasks yet</h3>
        <p className="task-list__empty-text">
          Create your first task to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default TaskList;
