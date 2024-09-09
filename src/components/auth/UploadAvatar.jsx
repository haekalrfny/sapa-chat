import React, { useState, useRef } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useUserStore } from "../../lib/userStore";

export default function UploadAvatar({ setValue }) {
  const [dragging, setDragging] = useState(false);
  const { currentUser } = useUserStore();
  const darkmode = currentUser?.darkmode;
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setValue({
        file: selectedFile,
        url: URL.createObjectURL(selectedFile),
      });
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className={`w-full max-w-[400px] max-h-[400px] border-2  rounded-md  flex flex-col items-center justify-center cursor-pointer transition-colors ${
        dragging
          ? "border-[#697565] bg-slate-100"
          : `${
              darkmode
                ? "bg-[#121212] border-gray-800"
                : "border-slate-300 bg-slate-100 "
            }`
      } ${file ? "p-0 border-none" : "p-10 border-dashed"}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      style={file ? { height: "auto" } : {}}
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      {file ? (
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={URL.createObjectURL(file)}
            alt="Uploaded"
            className="w-full h-full object-cover rounded-md max-w-[400px] max-h-[400px]"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <AiOutlineCloudUpload className="text-2xl text-[#697565] mb-1" />
          <p
            className={`text-sm ${
              darkmode ? "text-gray-400" : "text-gray-600"
            } text-center`}
          >
            Drag & drop your photo here, or click to select
          </p>
        </div>
      )}
    </div>
  );
}
