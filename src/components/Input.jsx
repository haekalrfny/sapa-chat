import React, { useState } from "react";
import { useStateContext } from "../context/StateContext";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useUserStore } from "../lib/userStore";

export default function Input({
  name,
  type,
  value,
  setValue,
  placeholder,
  isRequired,
  isHide,
  disabled,
  onSubmit, // Terima properti onSubmit
  isUsername,
}) {
  const { loading, loadingButton } = useStateContext();
  const { currentUser } = useUserStore();
  const darkmode = currentUser?.darkmode;
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSubmit) {
      onSubmit(e); // Panggil onSubmit saat Enter ditekan
    }
  };

  return (
    <div className="w-full relative">
      {!isHide && (
        <p
          className={`font-medium text-sm ${
            darkmode ? "text-white" : "text-gray-900 "
          } pb-1`}
        >
          {name} <span className="text-red-500">{isRequired ? "*" : ""}</span>
        </p>
      )}
      <div className={`relative ${isUsername ? "username-input" : ""}`}>
        {isUsername && (
          <span className="absolute inset-y-0 left-0 bottom-0.5 pl-3 flex items-center text-gray-500">
            @
          </span>
        )}
        <input
          disabled={loadingButton || loading || disabled}
          type={type === "password" && showPassword ? "text" : type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={` ${
            darkmode
              ? "bg-[#121212] border-gray-800 text-white"
              : "bg-slate-100"
          } border rounded-md py-2 px-3 text-sm w-full pr-10 ${
            disabled && "cursor-not-allowed"
          } ${isUsername ? "pl-8" : ""}`}
          placeholder={placeholder}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 top-0.5 right-0 pr-3 flex items-center text-gray-500"
            disabled={loadingButton || loading}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>
    </div>
  );
}
