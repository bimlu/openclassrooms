import archiver from 'archiver';
import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
const stream = require('stream');

import { uploadToS3BucketFromStream } from './s3-bucket';

/**
 * download images from s3, zip them and upload back to s3 in different folder
 * @see https://stackoverflow.com/questions/51938654/how-to-pipe-an-archive-zip-to-an-s3-bucket
 */

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});
const s3 = new AWS.S3({ region: process.env.AWS_REGION });

export const downloadFromS3AndZipToS3 = async (files, folder) => {
  // Use promises to get all images from s3
  const promises = [];
  files.map((file) => {
    promises.push(
      s3
        .getObject({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: file,
        })
        .promise()
    );
  });

  // Define the ZIP target archive
  let archive = archiver('zip', {
    zlib: { lever: 9 }, // Sets the compression level
  });

  // upload stream pass
  const uploadStream = new stream.PassThrough();

  // Pipe!
  archive.pipe(uploadStream);

  archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
      // log warning
    } else {
      // throw error
      throw err;
    }
  });

  // Good practice to catch this error explicitly
  archive.on('error', function (err) {
    throw err;
  });

  // The actual archive is populated here
  Promise.all(promises).then((data) => {
    data.map((file, i) => {
      archive.append(file.Body, { name: `${uuid()}.jpg` });
    });

    archive.finalize();
  });

  return uploadToS3BucketFromStream(uploadStream, folder);
};
