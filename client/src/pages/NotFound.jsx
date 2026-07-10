import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button.jsx';

export const NotFound = () => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
    <p className="font-display text-6xl font-semibold text-ink-900 dark:text-white">404</p>
    <p className="text-ink-500 dark:text-ink-400">This page doesn&apos;t exist.</p>
    <Button as={Link} to="/">
      Back home
    </Button>
  </div>
);
