import sharp from 'sharp';
// https://sharp.pixelplumbing.com/api-resize
// https://medium.com/javascript-in-plain-english/using-sharp-in-nodejs-to-output-resize-and-crop-images-on-the-fly-f8b150989760

export const transformer = ({ width = 600, quality = 85 }) => {
  return sharp().resize({ width }).toFormat('jpg', { quality });
};
