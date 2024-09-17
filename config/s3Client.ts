// Create service client module using ES6 syntax.
require('dotenv').config();

const { S3Client } = require('@aws-sdk/client-s3');
// Set the AWS Region.
const REGION = 'ap-northeast-1';
// Create an Amazon S3 service client object.
export const s3Client = new S3Client({
  region: REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
