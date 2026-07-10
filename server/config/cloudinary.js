import { v2 as cloudinary } from 'cloudinary';

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

export const isCloudinaryConfigured = Boolean(
  CLOUDINARY_CLOUD_NAME &&
    CLOUDINARY_API_KEY &&
    CLOUDINARY_API_SECRET &&
    CLOUDINARY_CLOUD_NAME !== 'your_cloud_name'
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
} else {
  console.warn(
    '[cloudinary] Credentials missing or still placeholders — image upload routes will return an error.\n' +
      '             Set CLOUDINARY_* vars in server/.env to enable uploads.'
  );
}

export default cloudinary;
