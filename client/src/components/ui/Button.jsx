import { clsx } from 'clsx';

const VARIANTS = {
  primary:
    'bg-ink-900 text-white hover:bg-ink-700 dark:bg-white dark:text-ink-900 dark:hover:bg-ink-100',
  secondary:
    'bg-brand-500 text-white hover:bg-brand-600',
  outline:
    'border border-ink-300 text-ink-800 hover:border-ink-900 dark:border-ink-600 dark:text-ink-100 dark:hover:border-white',
  ghost: 'text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

export const Button = ({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}) => (
  <Component
    className={clsx(
      'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 ease-out active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
      VARIANTS[variant],
      SIZES[size],
      className
    )}
    disabled={disabled || loading}
    {...props}
  >
    {loading && (
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
    )}
    {children}
  </Component>
);
