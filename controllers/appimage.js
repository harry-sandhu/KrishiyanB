require("dotenv").config();
const S3 = require("aws-sdk/clients/s3");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

function uploadFile(file) {
  const uploadParams = {
    Bucket: bucketName,
    Body: file.buffer,
    Key: file.originalname,
    ContentType: file.mimetype,
  };

  console.log("Uploading to S3:", uploadParams);

  return s3
    .upload(uploadParams)
    .promise()
    .then((data) => {
      console.log("File uploaded successfully at", data.Location);
      return data;
    })
    .catch((err) => {
      console.error("Error uploading file:", err);
      throw new Error("File upload failed");
    });
}

async function getFile(key, res) {
  console.log("Key for file retrieval:", key);
  const downloadParams = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    const s3Object = await s3.getObject(downloadParams).promise();

    res.set("Content-Type", "image/jpeg");
    res.set("Content-Disposition", "inline");

    res.status(200).send(s3Object.Body);
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = { uploadFile, getFile };
