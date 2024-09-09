import React from "react";
import { NavLink } from "react-router-dom";

export default function NavigateEachOther({ link, text, linkName }) {
  return (
    <p className="text-sm text-gray-500">
      {text}{" "}
      <NavLink to={link} className="hover:underline text-[#697565]">
        {linkName}
      </NavLink>
    </p>
  );
}
