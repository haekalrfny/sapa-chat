import React from "react";

export default function Checkbox({ text, setValue }) {
  return (
    <div className="flex items-center gap-1 text-sm">
      <input
        type="checkbox"
        onChange={(e) => setValue(e.target.checked)}
        id={text}
        className="cursor-pointer"
      />
      <label
        htmlFor={text}
        className=" text-gray-400 pb-1 cursor-pointer hover:text-[#5D6B5D]"
      >
        {text}
      </label>
    </div>
  );
}
