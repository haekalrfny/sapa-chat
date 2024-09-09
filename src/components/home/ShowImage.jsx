import React, { useEffect, useRef, useState } from "react";

export default function ShowImage({ url, onCancel }) {
  const [isExiting, setIsExiting] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleClose() {
    setIsExiting(true);
    setTimeout(() => {
      onCancel();
    }, 200);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <img
        ref={modalRef}
        src={url}
        alt="image"
        className={`max-h-[80vh] ${
          isExiting ? "animate-slidefromTop" : "animate-slideFromBottom"
        }`}
      />
    </div>
  );
}
