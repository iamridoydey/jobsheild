import React, { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

const ImageViewer = ({
  isImageOpen,
  setIsImageOpen,
  images,
}: {
  isImageOpen: boolean;
  setIsImageOpen: React.Dispatch<React.SetStateAction<boolean>>;
  images: string[];
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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
      images.splice(currentIndex, 1);
      setCurrentIndex(currentIndex % images.length);
    } else {
      setIsImageOpen(false);
    }
  };

  return isImageOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50 mx-3 md:mx-0">
      <div className="relative bg-red-400 p-4 rounded-lg shadow-lg w-full max-w-lg md:max-w-xl lg:max-w-2xl h-3/4 overflow-y-auto">
        <button
          onClick={() => setIsImageOpen(false)}
          className="absolute top-2 right-2 bg-gray-600 text-white p-1 rounded-full z-20"
        >
          <X size={16} />
        </button>
        {images.length > 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="relative w-full h-3/4">
              <Image
                src={images[currentIndex]}
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
                Previous
              </button>
              <button
                onClick={handleNext}
                className="bg-blue-700 text-white p-2 rounded-lg hover:bg-blue-600"
              >
                Next
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-700 text-white p-2 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export default ImageViewer;
