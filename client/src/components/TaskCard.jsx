import { Badge, Button } from './ui';
import './TaskCard.css';

/**
 * Formats a date string into a human-readable format.
 */
function formatDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Determines if a task is overdue (past due date and not done).
 */
function isOverdue(dueDate, status) {
  if (!dueDate || status === 'done') return false;
  return new Date(dueDate) < new Date();
}

/**
 * Status display labels.
 */
const STATUS_LABELS = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'done': 'Done',
};

const PRIORITY_LABELS = {
  'low': 'Low',
  'medium': 'Medium',
  'high': 'High',
};

/**
 * TaskCard — displays a single task with status/priority badges and action buttons.
 */
function TaskCard({ task, onEdit, onDelete }) {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className={`task-card ${task.status === 'done' ? 'task-card--done' : ''} ${overdue ? 'task-card--overdue' : ''}`}>
      <div className="task-card__header">
        <h3 className="task-card__title">{task.title}</h3>
        <div className="task-card__badges">
          <Badge type="status" value={task.status}>
            {STATUS_LABELS[task.status]}
          </Badge>
          <Badge type="priority" value={task.priority}>
            {PRIORITY_LABELS[task.priority]}
          </Badge>
        </div>
      </div>

      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}

      <div className="task-card__footer">
        <div className="task-card__meta">
          {task.dueDate && (
            <span className={`task-card__date ${overdue ? 'task-card__date--overdue' : ''}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {formatDate(task.dueDate)}
              {overdue && <span className="task-card__overdue-tag">Overdue</span>}
            </span>
          )}
        </div>
        <div className="task-card__actions">
          <Button variant="ghost" size="sm" onClick={() => onEdit(task)} aria-label="Edit task">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(task._id)} aria-label="Delete task">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
