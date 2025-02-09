import Image from "next/image";
import React, { useState, useEffect } from "react";

const FileInput = ({
  logo,
  setLogo,
}: {
  logo: File | null;
  setLogo: React.Dispatch<React.SetStateAction<File | null>>;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (logo) {
      const objectUrl = URL.createObjectURL(logo);
      setLogoPreview(objectUrl);

      // Clean up the object URL when the component unmounts or logo changes
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [logo]);

  const handleFileChange = (file: File) => {
    if (file) {
      setLogo(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileChange(file);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  return (
    <div className="upload_image_container">
      <h4 className="title font-bold">Logo</h4>
      <div className="flex flex-col items-center gap-2.5">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input")?.click()}
          className={`w-32 h-32 border-2 ${
            isDragging ? "border-blue-500" : "border-gray-300"
          } border-dashed rounded-lg flex justify-center items-center cursor-pointer ${
            isDragging ? "bg-blue-50" : "bg-gray-50"
          }`}
        >
          {logoPreview ? (
            <div className="w-full h-full relative">
              <Image
                src={logoPreview}
                alt="Uploaded"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ) : (
            <span className="flex flex-col items-center">
              <span className="text-2xl text-blue-500">+</span>
              <span className="text-[12px] text-gray-500">
                Drag & drop or click
              </span>
            </span>
          )}
        </div>
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default FileInput;
