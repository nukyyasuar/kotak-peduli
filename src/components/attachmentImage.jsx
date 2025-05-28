"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";

import { getAttachment } from "src/services/api/donation";

const AttachmentImage = ({ fileName, onSelect, onLoad, index, className }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoadingFetchImage, setIsLoadingFetchImage] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let objectUrl;

    const fetchImage = async () => {
      try {
        setIsLoadingFetchImage(true);

        const blob = await getAttachment(fileName);
        objectUrl = URL.createObjectURL(blob);
        if (isMounted) {
          setImageUrl(objectUrl);
          onLoad?.(objectUrl, index);
        }
      } catch (error) {
        console.error("Error loading image:", error);
      } finally {
        setIsLoadingFetchImage(false);
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [fileName]);

  if (!imageUrl || !fileName || !onLoad) {
    return (
      <div className="bg-gray-300 min-w-16 aspect-square rounded-lg animate-pulse" />
    );
  }

  return isLoadingFetchImage ? (
    <div className="bg-gray-300 min-w-16 aspect-square rounded-lg flex items-center justify-center">
      <ClipLoader size={24} color="#4A5568" loading={isLoadingFetchImage} />
    </div>
  ) : (
    <Image
      src={imageUrl}
      alt="Donation item image"
      fill
      className={`object-cover rounded-lg ${className}`}
      onClick={() => onSelect(imageUrl)}
    />
  );
};

export default AttachmentImage;
