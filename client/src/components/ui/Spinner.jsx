import { clsx } from 'clsx';

export const Spinner = ({ className }) => (
  <span
    className={clsx(
      'h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-ink-900 dark:border-ink-700 dark:border-t-white',
      className
    )}
  />
);
