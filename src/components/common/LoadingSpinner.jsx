import React from "react";

export default function LoadingSpinner({ size = "md" }) {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4"
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin`}
      />
    </div>
  );
}
