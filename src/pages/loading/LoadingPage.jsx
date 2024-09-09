import React from "react";
// components
import Loading from "../../components/Loading";

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 z-50">
      <Loading />
    </div>
  );
}
