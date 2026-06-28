import './Input.css';

/**
 * Styled input with label, error message, and optional character counter.
 * Supports both input and textarea via the `as` prop.
 */
function Input({
  label,
  error,
  maxLength,
  value = '',
  as = 'input',
  id,
  className = '',
  ...props
}) {
  const Component = as;
  const charCount = typeof value === 'string' ? value.length : 0;

  return (
    <div className={`input-group ${error ? 'input-group--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="input-group__label">
          {label}
        </label>
      )}
      <Component
        id={id}
        className="input-group__field"
        value={value}
        maxLength={maxLength}
        {...props}
      />
      <div className="input-group__footer">
        {error && <span className="input-group__error">{error}</span>}
        {maxLength && (
          <span className="input-group__counter">
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}

export default Input;
