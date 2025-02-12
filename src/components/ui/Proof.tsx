import { X } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import ImageViewer from "./ImageViewer";

const Proof = ({
  isOpen,
  setIsOpen,
  text,
  setText,
  images,
  setImages,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
}) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Generate preview URLs for images
  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    // Cleanup URLs when component unmounts or images change
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = event.target.value;
    const words = inputText.trim().split(/\s+/).filter(Boolean).length; // Count words
    if (words <= 250) {
      setText(inputText);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleDeleteImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setIsImageOpen(true);
  };

  const handleSubmit = () => {
    // Store data or handle submission logic
    console.log("Text:", text);
    console.log("Images:", images);
    setIsOpen(false);
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-zinc-700 bg-opacity-80">
      <div className="create_proof_wrapper border-gray-400 border-[1px] bg-gray-800 rounded-lg shadow-md w-full max-w-lg md:max-w-xl lg:max-w-2xl overflow-y-auto relative mx-3">
        <h3 className="px-6 py-2 text-gray-200 font-bold text-lg flex justify-between items-center border-b-[1px]">
          Add New Proof
          <button
            onClick={() => setIsOpen(false)}
            className="bg-gray-600 text-white rounded-full p-1"
          >
            <X size={16} />
          </button>
        </h3>
        <div className="flex flex-col items-center gap-4 p-6 pb-8">
          {/* Textarea */}
          <div className="w-full">
            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Enter your proof (max 250 words)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={5}
            />
            <p className="text-sm text-gray-200 mt-1 font-bold">
              {text.trim().split(/\s+/).filter(Boolean).length} / 250 words
            </p>
          </div>

          {/* Image Upload */}
          <div className="w-full">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="w-full p-3 border border-gray-300 rounded-lg cursor-pointer flex justify-center items-center bg-white hover:bg-gray-100"
            >
              <span className="text-blue-500">Upload Image</span>
            </label>
          </div>

          {/* Image Preview */}
          <div className="grid grid-cols-3 gap-4 mt-4 w-full">
            {previewUrls
              .slice(0, previewUrls.length == 3 ? previewUrls.length : 2)
              .map((image, index) => (
                <div
                  key={index}
                  className="relative h-24 md:h-32 lg:h-48"
                  onClick={() => openImageViewer(index)}
                >
                  <Image
                    src={image}
                    alt={`Uploaded Image ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg cursor-pointer"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(index);
                    }}
                    className="absolute top-2 right-2 w-6 h-6 bg-gray-500 text-white p-1 rounded-full flex items-center justify-center font-bold"
                  >
                    <X />
                  </button>
                </div>
              ))}
            {images.length > 3 && (
              <div className="relative h-24 md:h-32 lg:h-48 flex justify-center items-center bg-gray-100 border border-gray-300 rounded-lg">
                <span className="text-2xl text-blue-500">
                  +{images.length - 3}
                </span>
              </div>
            )}
          </div>

          {/* Create Button */}
          <button
            onClick={handleSubmit}
            className="w-full py-2 px-4 bg-blue-700 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Create
          </button>
        </div>
      </div>
      <ImageViewer
        isImageOpen={isImageOpen}
        setIsImageOpen={setIsImageOpen}
        images={images} 
        setImages={setImages} 
        currentImageIndex={currentImageIndex}
      />
    </div>
  ) : null;
};

export default Proof;
