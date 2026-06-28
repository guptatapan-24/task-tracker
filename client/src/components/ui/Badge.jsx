import './Badge.css';

/**
 * Color-coded badge for status and priority display.
 * Type: 'status' or 'priority' determines the color scheme.
 */
function Badge({ children, type = 'status', value }) {
  return (
    <span className={`badge badge--${type} badge--${value}`}>
      {children}
    </span>
  );
}

export default Badge;
