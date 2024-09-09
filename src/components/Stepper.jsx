import React from "react";
import { MdCheck } from "react-icons/md";

export default function Stepper({ steps, currentStep }) {
  return (
    <ol className="flex items-center w-full">
      {steps.map((step, index) => (
        <li
          key={index}
          className={`flex w-full items-center ${
            index < steps.length - 1
              ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-100 after:border-4 after:inline-block "
              : ""
          }`}
        >
          <span
            title={step}
            className={`flex  items-center justify-center w-8 h-8 ${
              index < currentStep
                ? "bg-[#697565]  text-white "
                : "bg-gray-100  text-gray-500 "
            } rounded-full lg:h-10 lg:w-10 shrink-0`}
          >
            {index < currentStep ? (
              <MdCheck className="w-4 h-4 lg:w-5 lg:h-5" />
            ) : (
              <span className="text-sm lg:text-base">{index + 1}</span>
            )}
          </span>
        </li>
      ))}
    </ol>
  );
}
