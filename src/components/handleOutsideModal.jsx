"use client";

import { useEffect } from "react";

export default function handleOutsideModal({
  ref,
  isOpen,
  onClose,
  resets = [],
}) {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        resets.forEach((reset) => reset());
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, ref, onClose, resets]);
}
