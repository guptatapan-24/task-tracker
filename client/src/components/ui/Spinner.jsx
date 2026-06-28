import './Spinner.css';

/**
 * CSS-animated loading spinner.
 * Use size prop for small/medium/large variants.
 */
function Spinner({ size = 'md' }) {
  return (
    <div className={`spinner-container`}>
      <div className={`spinner spinner--${size}`} />
    </div>
  );
}

export default Spinner;
