import React from "react";
// icons
import { FiSearch } from "react-icons/fi";
import { useUserStore } from "../lib/userStore";

export default function Search({ value, setValue, onSubmit, isUsername }) {
  const { currentUser } = useUserStore();
  const darkmode = currentUser?.darkmode;

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSubmit(e);
    }
  };

  return (
    <div
      className={`relative w-full py-2 px-3 ${
        darkmode
          ? "bg-[#121212] text-white focus-within:ring-slate-100"
          : "bg-slate-100 focus-within:ring-black text-gray-900"
      }  rounded-md flex items-center gap-1 justify-between focus-within:ring-1 ${
        isUsername ? "username-input" : ""
      }`}
    >
      {isUsername && (
        <span className="absolute inset-y-0 left-0 bottom-0.5 pl-3 flex items-center text-gray-500">
          @
        </span>
      )}
      <input
        type="text"
        placeholder="Search..."
        className={`bg-transparent outline-none w-full text-sm ${
          isUsername ? "pl-6" : ""
        }`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={onSubmit}>
        <FiSearch
          className={`text-xl ${darkmode ? "text-white" : "text-gray-900"} `}
        />
      </button>
    </div>
  );
}
