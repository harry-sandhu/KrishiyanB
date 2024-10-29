require("dotenv").config();
const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

//upload function

function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };
  console.log(uploadParams);
  return s3.upload(uploadParams).promise();
}

//download function

async function getFile(key) {
  console.log("key getFile:", key);
  const downloadParams = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    return s3.getObject(downloadParams).createReadStream();
  } catch (error) {
    console.error("Error fetching file:", error);
    throw new Error("File retrieval failed");
  }
}

module.exports = { uploadFile, getFile };
