import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'ap-south-1',
});
const lambda = new AWS.Lambda();

export const invokeLambdaToZipImages = async (images) => {
  const params = {
    FunctionName: 'test-function',
    Payload: JSON.stringify(images),
  };

  return new Promise((resolve, reject) => {
    lambda.invoke(params, (error, result) => {
      if (result) {
        console.log('***', 'Invoked lambda server');
        resolve(result);
      } else {
        console.log(error);
        reject(error);
      }
    });
  });
};
