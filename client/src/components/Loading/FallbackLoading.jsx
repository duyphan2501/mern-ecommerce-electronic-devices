import React from "react";

const FallbackLoading = () => {
  return (
    <div className="flex items-center justify-center h-100">
      <div className="animate-spin rounded-full size-10 border-y-3 border-blue-500"></div>
    </div>
  );
};

export default FallbackLoading;
