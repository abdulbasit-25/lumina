import { v2 as cloudinary } from "cloudinary";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "dmorye4c0";

function getCloudinaryConfig() {
  const API_KEY = process.env.CLOUDINARY_API_KEY;
  const API_SECRET = process.env.CLOUDINARY_API_SECRET;

  if (!API_KEY || !API_SECRET) {
    throw new Error(
      "Please define CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET environment variables"
    );
  }

  return { API_KEY, API_SECRET };
}

export async function uploadToCloudinary(fileBuffer: Buffer, fileName: string) {
  const { API_KEY, API_SECRET } = getCloudinaryConfig();

  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
  });

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "lumina-studio/posters",
        public_id: fileName.replace(/\.[^.]*$/, ""),
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            secure_url: result?.secure_url,
            public_id: result?.public_id,
            url: result?.url,
          });
        }
      }
    );

    stream.end(fileBuffer);
  });
}

export async function deleteFromCloudinary(publicId: string) {
  const { API_KEY, API_SECRET } = getCloudinaryConfig();

  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
  });

  return cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
