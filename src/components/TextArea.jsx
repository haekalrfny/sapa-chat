import React from "react";
import { useUserStore } from "../lib/userStore";

export default function TextArea({
  name,
  type,
  placeholder,
  value,
  setValue,
  isRequired,
  maxHeight,
}) {
  const { currentUser } = useUserStore();
  const darkmode = currentUser?.darkmode;
  return (
    <div>
      <label className={`font-medium text-sm ${darkmode ? "text-white" :'text-gray-900'}  pb-1 block`}>
        {name} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type={type}
        placeholder={placeholder}
        style={{ maxHeight: maxHeight }}
        className={`${darkmode ? "bg-[#121212] border-gray-800 text-white" : "bg-white"} border rounded-md py-2 px-3 text-sm w-full pr-10`}
      />
    </div>
  );
}
