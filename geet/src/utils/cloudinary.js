import cloudinary from 'cloudinary';
import { v4 as uuid } from 'uuid';

export const uploadToCloudinary = async (stream, folder, transformer, imagePublicId) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });
  // if imagePublicId param is presented we should overwrite the image
  const options = imagePublicId
    ? { public_id: imagePublicId, overwrite: true }
    : { public_id: `${process.env.DB_NAME}/${folder}/${uuid()}` };

  return new Promise((resolve, reject) => {
    const streamLoad = cloudinary.v2.uploader.upload_stream(options, (error, result) => {
      if (result) {
        console.log('***', `Successfully uploaded image to Cloudinary at ${result.secure_url}`);
        resolve(result);
      } else {
        console.log('***', `Failed to upload image to Cloudinary. ${error.message}`);
        reject(error);
      }
    });

    // pipe stream to transformer and then cloudinary
    stream.pipe(transformer).pipe(streamLoad);
  });
};

export const deleteFromCloudinary = async (publicId) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });

  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.destroy(publicId, (error, result) => {
      if (result) {
        console.log('***', `Successfully deleted image from Cloudinary`);
        resolve(result);
      } else {
        console.log('***', `Failed to delete image from Cloudinary. ${error.message}`);
        reject(error);
      }
    });
  });
};
