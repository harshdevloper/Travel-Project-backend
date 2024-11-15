import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto', // Let Cloudinary handle different file types
    });

    if (!response) {
      console.error('Error uploading file to Cloudinary');
      return null;
    }

    // Delete the local file after upload
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // Delete local file in case of error
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.error('Error uploading to Cloudinary:', error);
    return null;
  }
};

export { uploadOnCloudinary };
