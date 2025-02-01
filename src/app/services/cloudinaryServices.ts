/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary, UploadApiResponse, UploadStream } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET as string,
});

export class CloudinaryServices {
  static async uploadImage(
    stream: NodeJS.ReadableStream
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const streamLoad: UploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );
      stream.pipe(streamLoad);
    });
  }

  static async deleteImage(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
  }
}
