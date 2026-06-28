import './Button.css';

/**
 * Reusable button with variant styles and loading state.
 * Variants: primary (default), secondary, danger, ghost
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="btn__spinner" />}
      {children}
    </button>
  );
}

export default Button;
