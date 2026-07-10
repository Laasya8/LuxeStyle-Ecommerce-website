import { getAuth, clerkClient } from '@clerk/express';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isDbConnected } from '../config/db.js';
import { isClerkConfigured } from '../config/clerk.js';

/**
 * Finds the local Mongo User for the authenticated Clerk session, creating it
 * on first sight. This is the fallback path for when the Clerk webhook hasn't
 * fired yet (e.g. local dev without a public URL) — see config/clerk.js.
 */
const getOrCreateUser = async (clerkId) => {
  let user = await User.findOne({ clerkId });
  if (user) return user;

  const clerkUser = await clerkClient.users.getUser(clerkId);
  const email = clerkUser.emailAddresses?.find(
    (e) => e.id === clerkUser.primaryEmailAddressId
  )?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress;

  user = await User.create({
    clerkId,
    name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || 'New User',
    email,
    phone: clerkUser.phoneNumbers?.[0]?.phoneNumber,
    avatar: clerkUser.imageUrl,
  });

  return user;
};

/** Requires a valid Clerk session; attaches the local Mongo user doc as req.user. */
export const requireAuth = asyncHandler(async (req, res, next) => {
  if (!isClerkConfigured) {
    throw new ApiError(503, 'Authentication is not configured on the server yet.');
  }

  const { userId } = getAuth(req);
  if (!userId) {
    throw new ApiError(401, 'Not authenticated');
  }

  if (!isDbConnected()) {
    throw new ApiError(503, 'Database is not connected yet.');
  }

  req.user = await getOrCreateUser(userId);
  next();
});

/** Same as requireAuth, but does not fail when there is no session — req.user may be null. */
export const attachUserIfPresent = asyncHandler(async (req, res, next) => {
  if (!isClerkConfigured || !isDbConnected()) return next();

  const { userId } = getAuth(req);
  if (userId) {
    req.user = await getOrCreateUser(userId);
  }
  next();
});

export const requireAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    throw new ApiError(403, 'Admin access required');
  }
  next();
});
