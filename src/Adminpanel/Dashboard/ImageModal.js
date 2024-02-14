import React from 'react';

const ImageModal = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="max-w-full max-h-full">
        <img src={imageUrl} alt="Full Size" className="max-w-full max-h-full" />
        <button onClick={onClose} className="absolute top-0 right-0 p-2 m-4 bg-white rounded-full text-black hover:bg-gray-200">&times;</button>
      </div>
    </div>
  );
};

export default ImageModal;
