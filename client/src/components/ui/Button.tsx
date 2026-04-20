import { forwardRef, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  full?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size, loading, full, disabled, children, className = '', ...props }, ref) => {
    const cls = [
      'btn',
      `btn-${variant}`,
      size ? `btn-${size}` : '',
      full ? 'btn-full' : '',
      className,
    ].filter(Boolean).join(' ');

    return (
      <button ref={ref} className={cls} disabled={disabled || loading} {...props}>
        {loading && <span>... </span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
