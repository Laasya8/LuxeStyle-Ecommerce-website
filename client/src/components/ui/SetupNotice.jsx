export const SetupNotice = () => (
  <div className="flex min-h-screen items-center justify-center bg-ink-50 px-6 dark:bg-ink-900">
    <div className="max-w-lg rounded-3xl border border-ink-200 bg-white p-8 text-center shadow-xl dark:border-ink-700 dark:bg-ink-800">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-2xl dark:bg-brand-900/40">
        🔑
      </div>
      <h1 className="text-xl font-semibold text-ink-900 dark:text-white">
        Clerk authentication isn&apos;t configured yet
      </h1>
      <p className="mt-3 text-sm text-ink-500 dark:text-ink-300">
        Add your publishable key to <code className="rounded bg-ink-100 px-1.5 py-0.5 dark:bg-ink-700">client/.env</code> as{' '}
        <code className="rounded bg-ink-100 px-1.5 py-0.5 dark:bg-ink-700">VITE_CLERK_PUBLISHABLE_KEY</code>, then restart the
        dev server. You can find it at{' '}
        <span className="font-medium text-ink-800 dark:text-ink-100">dashboard.clerk.com → API Keys</span>.
      </p>
    </div>
  </div>
);
