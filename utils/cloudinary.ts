import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadFile(filePath: string, folder: string) {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.warn('Cloudinary not configured');
    return { url: `mock-url/${folder}/file`, publicId: 'mock-id' };
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `invoice-app/${folder}`,
      resource_type: 'auto',
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

export async function deleteFile(publicId: string) {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return { success: true };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
}
