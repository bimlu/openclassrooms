import { v4 as uuid } from 'uuid';
import fs from 'fs';
import path from 'path';

// fs.mkdir recursively create any directories in a path that don't exist,
// and ignore ones that do.
// https://stackoverflow.com/questions/21194934/how-to-create-a-directory-if-it-doesnt-exist-using-node-js

export const saveImageToDisk = (stream, folder, filename, imagePublicId) => {
  let imageDir;

  // if imagePublicId param is presented we should overwrite the image
  if (imagePublicId) {
    imageDir = path.resolve(__dirname, '../uploads');

    stream.pipe(fs.createWriteStream(`${imageDir}/${imagePublicId}`));
  } else {
    imageDir = path.resolve(__dirname, '../uploads', folder);

    filename = `${uuid()}.${filename}`;

    fs.mkdir(imageDir, { recursive: true }, (err) => {
      if (err) throw err;

      // pipe stream to imagePath
      stream.pipe(fs.createWriteStream(`${imageDir}/${filename}`));
    });

    imagePublicId = `${folder}/${filename}`;
  }

  // return image url string and public_id for database to save
  return {
    secure_url: `${process.env.API_URL}/uploads/${imagePublicId}`,
    public_id: imagePublicId,
  };
};

export const deleteImageFromDisk = (imagePublicId) => {
  const imagePath = path.resolve(__dirname, '../uploads', imagePublicId);
  fs.unlink(imagePath, (err) => {
    if (err) throw err;
  });

  return {
    result: 'ok',
  };
};
