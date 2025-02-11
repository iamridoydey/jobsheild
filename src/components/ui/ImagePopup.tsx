import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";


interface ImagePopupProps {
  images: string[];
  onClose: () => void;
  initialIndex: number;
}

const ImagePopup: React.FC<ImagePopupProps> = ({
  images,
  onClose,
  initialIndex,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
        >
          <X/>
        </button>
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-2 bg-gray-500 text-white rounded-md p-2"
        >
          <ChevronLeft/>
        </button>
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-2 bg-gray-500 text-white rounded-md p-2"
        >
          <ChevronRight/>
        </button>
        <Image
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          width={500}
          height={500}
          className="rounded-md"
        />
      </div>
    </div>
  );
};

export default ImagePopup;
