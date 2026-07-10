import { Webhook } from 'svix';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isClerkWebhookConfigured } from '../config/clerk.js';

const buildEmail = (data) =>
  data.email_addresses?.find((e) => e.id === data.primary_email_address_id)?.email_address ||
  data.email_addresses?.[0]?.email_address;

/**
 * Verifies and handles Clerk webhook events, keeping the local User collection
 * in sync in real time. Requires the raw request body (mounted before
 * express.json() in server.js) so the svix signature can be verified.
 */
export const handleClerkWebhook = asyncHandler(async (req, res) => {
  if (!isClerkWebhookConfigured) {
    throw new ApiError(503, 'Clerk webhook secret is not configured on the server.');
  }

  const svixId = req.headers['svix-id'];
  const svixTimestamp = req.headers['svix-timestamp'];
  const svixSignature = req.headers['svix-signature'];

  if (!svixId || !svixTimestamp || !svixSignature) {
    throw new ApiError(400, 'Missing svix headers');
  }

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
  let event;

  try {
    event = wh.verify(req.body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    });
  } catch (err) {
    throw new ApiError(400, `Webhook signature verification failed: ${err.message}`);
  }

  const { type, data } = event;

  switch (type) {
    case 'user.created': {
      await User.findOneAndUpdate(
        { clerkId: data.id },
        {
          $setOnInsert: {
            clerkId: data.id,
            name: [data.first_name, data.last_name].filter(Boolean).join(' ') || 'New User',
            email: buildEmail(data),
            phone: data.phone_numbers?.[0]?.phone_number,
            avatar: data.image_url,
          },
        },
        { upsert: true, new: true }
      );
      break;
    }
    case 'user.updated': {
      await User.findOneAndUpdate(
        { clerkId: data.id },
        {
          name: [data.first_name, data.last_name].filter(Boolean).join(' ') || 'New User',
          email: buildEmail(data),
          phone: data.phone_numbers?.[0]?.phone_number,
          avatar: data.image_url,
        }
      );
      break;
    }
    case 'user.deleted': {
      await User.findOneAndDelete({ clerkId: data.id });
      break;
    }
    default:
      break;
  }

  res.status(200).json({ success: true, received: true });
});
