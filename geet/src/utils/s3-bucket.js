import AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});
const s3 = new AWS.S3();

export const uploadToS3Bucket = async (stream, folder, transformer) => {
  const options = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${folder}/${uuid()}.jpg`,
    Body: stream.pipe(transformer),
    ContentType: 'image/jpeg',
  };

  return new Promise((resolve, reject) => {
    s3.upload(options, (error, result) => {
      if (result) {
        console.log('***', `Successfully uploaded image to S3 at ${result.Location}`);
        resolve(result);
      } else {
        console.log('***', `Failed to upload image to S3. ${error.message}`);
        reject(error);
      }
    });
  });
};

export const deleteFromS3Bucket = (imagePublicId) => {
  const options = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: imagePublicId,
  };

  return new Promise((resolve, reject) => {
    s3.deleteObject(options, (error, result) => {
      if (result) {
        console.log('***', `Successfully deleted image from S3`);
        resolve(result);
      } else {
        console.log('***', `Failed to delete image from S3. ${error.message}`);
        reject(error);
      }
    });
  });
};

export const uploadToS3BucketFromStream = (pass, folder) => {
  const options = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${folder}/${uuid()}.zip`,
    Body: pass,
    ContentType: 'application/zip',
  };

  return s3.upload(options).promise();
};

export const uploadPDFToS3Bucket = async (stream, folder, fileName) => {
  const fileExt = fileName.split('.').pop();

  const options = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${folder}/${uuid()}.${fileExt}`,
    Body: stream,
    ContentType: 'application/pdf;application/msword',
    ContentDisposition: `attachment;filename=${fileName}`,
  };

  return new Promise((resolve, reject) => {
    s3.upload(options, (error, result) => {
      if (result) {
        console.log('***', `Successfully uploaded pdf to S3 at ${result.Location}`);
        resolve(result);
      } else {
        console.log('***', `Failed to upload pdf to S3. ${error.message}`);
        reject(error);
      }
    });
  });
};

export const deletePDFFromS3Bucket = (pdfPublicId) => {
  const options = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: pdfPublicId,
  };

  return new Promise((resolve, reject) => {
    s3.deleteObject(options, (error, result) => {
      if (result) {
        console.log('***', `Successfully deleted pdf from S3`);
        resolve(result);
      } else {
        console.log('***', `Failed to delete pdf from S3. ${error.message}`);
        reject(error);
      }
    });
  });
};
