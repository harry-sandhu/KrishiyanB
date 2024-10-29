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
async function getFile(key, res) {
  console.log("Key for file retrieval:", key);
  const downloadParams = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    const s3Object = await s3.getObject(downloadParams).promise();

    // Set the appropriate content type for the image
    res.set("Content-Type", s3Object.ContentType);
    res.set("Content-Disposition", "inline"); // To display in the browser or Postman

    // Send the image buffer as the response
    res.status(200).send(s3Object.Body);
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = { uploadFile, getFile };
