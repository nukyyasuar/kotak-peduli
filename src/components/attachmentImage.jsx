"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

import { getAttachment } from "src/services/api/donation";

const AttachmentImage = ({ fileName, onSelect, onLoad, index, className }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let objectUrl;

    const fetchImage = async () => {
      try {
        const blob = await getAttachment(fileName);
        objectUrl = URL.createObjectURL(blob);
        if (isMounted) {
          setImageUrl(objectUrl);
          onLoad?.(objectUrl, index);
        }
      } catch (error) {
        console.error("Error loading image:", error);
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [fileName]);

  if (!imageUrl) {
    return (
      <div className="bg-gray-300 min-w-16 aspect-square rounded-lg animate-pulse" />
    );
  }

  return (
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
