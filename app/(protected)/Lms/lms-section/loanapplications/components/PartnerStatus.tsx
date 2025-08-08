import React, { useState } from "react";

function PartnerStatus({ close }: { close: any }) {
 


  

  const handleClose = () => {
    close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white max-w-lg w-full p-6 rounded-lg shadow-lg space-y-4 relative">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-lg text-red-500 hover:text-red-700"
        >
          ×
        </button>

       
      </div>
    </div>
  );
}

export default PartnerStatus;
