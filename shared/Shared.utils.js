import AWS from 'aws-sdk';

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  },
});

export const uploadImage = async (file, userId, folderName) => {
  const { filename, createReadStream } = await file;
  const body = createReadStream();
  const objectName = `${folderName}/${userId}-${Date.now()
    .toString(36)
    .slice(0, 6)}-${filename}`;
  const { Location } = await new AWS.S3()
    .upload({
      Body: body,
      Key: objectName,
      Bucket: 'instamatrix',
      ACL: 'public-read',
      ContentType: 'image/jpeg',
    })
    .promise();
  return Location;
};
