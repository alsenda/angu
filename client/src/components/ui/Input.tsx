import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, id, ...props }, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="form-group">
      {label && <label htmlFor={inputId} className="form-label">{label}</label>}
      <input
        ref={ref}
        id={inputId}
        className={`form-input${error ? ' has-error' : ''}`}
        {...props}
      />
      {error && <p className="form-error-text">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
