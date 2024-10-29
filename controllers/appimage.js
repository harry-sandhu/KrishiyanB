require("dotenv").config();
const S3 = require("aws-sdk/clients/s3");
// No need to require fs if you're not using it
// const fs = require("fs");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

// Initialize S3 client
const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// Upload function
function uploadFile(file) {
  const uploadParams = {
    Bucket: bucketName,
    Body: file.buffer,
    Key: file.originalname, // Consider adding a unique identifier to prevent overwriting
    ContentType: file.mimetype,
  };

  console.log("Uploading to S3:", uploadParams); // Log the parameters being used for upload

  return s3
    .upload(uploadParams)
    .promise()
    .then((data) => {
      console.log("File uploaded successfully at", data.Location); // Log success message with file location
      return data; // Return the upload result
    })
    .catch((err) => {
      console.error("Error uploading file:", err); // Log error if upload fails
      throw new Error("File upload failed");
    });
}

// Download function
async function getFile(key) {
  console.log("Key for file retrieval:", key);
  const downloadParams = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    const data = await s3.getObject(downloadParams).promise(); // Use promise-based method for consistency
    return data.Body; // Return the file's body (Buffer)
  } catch (error) {
    console.error("Error fetching file:", error);
    throw new Error("File retrieval failed");
  }
}

module.exports = { uploadFile, getFile };
