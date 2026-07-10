import { useCurrentUser } from '../hooks/useCurrentUser.js';
import { Spinner } from '../components/ui/Spinner.jsx';

export const Profile = () => {
  const { user, loading } = useCurrentUser();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container-page max-w-2xl py-10">
      <h1 className="text-2xl font-semibold text-ink-900 dark:text-white">My Profile</h1>

      {!user ? (
        <p className="mt-4 text-sm text-ink-500">
          Couldn&apos;t load your profile — the database or Clerk credentials may not be configured yet.
        </p>
      ) : (
        <div className="mt-6 flex items-center gap-4 rounded-2xl border border-ink-200 p-6 dark:border-ink-800">
          {user.avatar && (
            <img src={user.avatar} alt={user.name} className="h-16 w-16 rounded-full object-cover" />
          )}
          <div>
            <p className="text-lg font-medium text-ink-900 dark:text-white">{user.name}</p>
            <p className="text-sm text-ink-500">{user.email}</p>
            <span className="mt-1 inline-block rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
              {user.role}
            </span>
          </div>
        </div>
      )}

      <p className="mt-6 text-xs text-ink-400">
        Edit profile & address management land in Phase 3.
      </p>
    </div>
  );
};
