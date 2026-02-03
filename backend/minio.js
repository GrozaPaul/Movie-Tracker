import * as Minio from "minio";

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const BUCKET_NAME = "movie-tracker-images";

export const initializeBucket = async () => {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME);
      console.log(`Bucket ${BUCKET_NAME} created`);
    } else {
      console.log(`Bucket ${BUCKET_NAME} already exists`);
    }
  } catch (error) {
    console.error("MinIO initialization error:", error);
  }
};

export const getImageUrl = (objectName) => {
  return `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${BUCKET_NAME}/${objectName}`;
};

export const uploadImageFromUrl = async (objectName, imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok)
      throw new Error(`Failed to fetch image: ${response.status}`);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const contentType = response.headers.get("content-type") || "image/jpeg";

    await minioClient.putObject(
      BUCKET_NAME,
      objectName,
      buffer,
      buffer.length,
      {
        "Content-Type": contentType,
      },
    );
  } catch (error) {
    console.error("Error uploading image from URL:", error);
    throw error;
  }
};

export const uploadImageFromBuffer = async (
  objectName,
  fileBuffer,
  contentType = "image/jpeg",
) => {
  try {
    await minioClient.putObject(
      BUCKET_NAME,
      objectName,
      fileBuffer,
      fileBuffer.length,
      {
        "Content-Type": contentType,
      },
    );

    return getImageUrl(objectName);
  } catch (error) {
    console.error("Error uploading image from buffer:", error);
    throw error;
  }
};

export const deleteImage = async (objectName) => {
  try {
    await minioClient.removeObject(BUCKET_NAME, objectName);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};
