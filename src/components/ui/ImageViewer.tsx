import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Trash2, X } from "lucide-react";

const ImageViewer = ({
  isImageOpen,
  setIsImageOpen,
  images,
  setImages,
  currentImageIndex,
}: {
  isImageOpen: boolean;
  setIsImageOpen: React.Dispatch<React.SetStateAction<boolean>>;
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  currentImageIndex: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(currentImageIndex);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const handleDelete = () => {
    if (images.length > 1) {
      const updatedImages = images.filter((_, index) => index !== currentIndex);
      setImages(updatedImages);
      setCurrentIndex((prevIndex) =>
        prevIndex >= updatedImages.length ? 0 : prevIndex
      );
    } else {
      setIsImageOpen(false);
    }
  };

  return isImageOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-zinc-800 bg-opacity-80">
      <div className="relative bg-gray-700 rounded-lg shadow-lg w-full max-w-lg md:max-w-xl lg:max-w-2xl h-[50%] md:h-[60%] overflow-y-none border-gray-200 border-[1px] mx-3 md:mx-0">
        <h3 className="image_viewer px-6 py-2 text-gray-200 font-bold text-lg flex justify-between items-center border-b-[1px]">
          Image Viewer
          <button
            onClick={() => setIsImageOpen(false)}
            className="absolute top-2 right-2 bg-gray-600 text-white p-1 rounded-full z-20"
          >
            <X size={16} />
          </button>
        </h3>
        {images.length > 0 && (
          <div className="flex flex-col items-center justify-center h-[90%] p-6">
            <div className="relative w-full h-3/4">
              <Image
                src={URL.createObjectURL(images[currentIndex])}
                alt={`Image ${currentIndex + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <div className="flex justify-between items-center w-full mt-4">
              <button
                onClick={handlePrev}
                className="bg-blue-700 text-white p-2 rounded-lg hover:bg-blue-600"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={handleNext}
                className="bg-blue-700 text-white p-2 rounded-lg hover:bg-blue-600"
              >
                <ChevronRight />
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-700 text-white p-2 rounded-lg hover:bg-red-600"
              >
                <Trash2 />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export default ImageViewer;
