import React, { useEffect, useRef } from "react";
import { FiSave } from "react-icons/fi";
import { useUserStore } from "../lib/userStore";

export default function Dropdown({ items, onCancel }) {
  const { currentUser } = useUserStore();
  const darkmode = currentUser?.darkmode;
  const modalRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onCancel();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <ul
      ref={modalRef}
      className={`absolute z-10 ${
        darkmode ? "bg-[#0b0b0b] border border-gray-800" : "bg-white border"
      } shadow-lg rounded-md w-max p-1.5 text-sm top-8`}
    >
      {items.map((item, index) => (
        <div
          onClick={item.onClick}
          key={index}
          className={`flex items-center py-1.5 px-3 ${
            darkmode ? "hover:bg-[#121212]" : "hover:bg-gray-100"
          }  cursor-pointer rounded-md gap-2`}
        >
          <item.icon />
          <li className="font-medium">{item.text}</li>
        </div>
      ))}
    </ul>
  );
}
