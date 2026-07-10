const { CLERK_SECRET_KEY, CLERK_PUBLISHABLE_KEY, CLERK_WEBHOOK_SECRET } = process.env;

export const isClerkConfigured = Boolean(
  CLERK_SECRET_KEY && !CLERK_SECRET_KEY.includes('REPLACE_WITH_YOUR_KEY')
);

export const isClerkWebhookConfigured = Boolean(
  CLERK_WEBHOOK_SECRET && !CLERK_WEBHOOK_SECRET.includes('REPLACE_WITH_YOUR_KEY')
);

if (!isClerkConfigured) {
  console.warn(
    '[clerk] CLERK_SECRET_KEY is missing or still a placeholder — authenticated routes will reject requests.\n' +
      '        Set CLERK_SECRET_KEY / CLERK_PUBLISHABLE_KEY in server/.env (from dashboard.clerk.com).'
  );
}

if (!isClerkWebhookConfigured) {
  console.warn(
    '[clerk] CLERK_WEBHOOK_SECRET is missing — user sync will rely on the get-or-create fallback only.\n' +
      '        Configure a webhook at dashboard.clerk.com -> Webhooks -> /api/webhooks/clerk to enable real-time sync.'
  );
}

export const clerkEnv = { CLERK_SECRET_KEY, CLERK_PUBLISHABLE_KEY, CLERK_WEBHOOK_SECRET };
