export const handleUploadImages = async (images: File[]) => {
  const urls = await Promise.all(images.map((image) => uploadFile(image)));
  return urls.filter((url) => url !== null);
};

export const handleUploadLogo = async (image: File | null) => {
  if (!image) return null;
  return await uploadFile(image);
};

const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "jobsheild_uploads");

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    console.log("response : ", response);

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    console.log("Cloudinary Response: ", data);
    return data.secure_url;
  } catch (error) {
    console.error("Upload Error:", error);
    return null;
  }
};
