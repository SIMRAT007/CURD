import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage'; // Import Firebase Storage functions
import { storage } from '../../firebase-config'; // Import Firebase Storage instance

const Banner = () => {
  const [imageUrl, setImageUrl] = useState('');

  const fetchLatestImage = () => {
    // List all files in the "banner" folder
    listAll(ref(storage, 'banner')).then((res) => {
      // Get the last file in the list (assuming it's the latest uploaded)
      const latestFile = res.items[res.items.length - 1];
      // Get the download URL of the latest file
      getDownloadURL(latestFile).then((url) => {
        setImageUrl(url); // Store the download URL
      });
    }).catch((error) => {
      console.error('Error fetching latest image:', error);
    });
  };

  const handleUpdateImage = () => {
    // Reset imageUrl state
    setImageUrl('');
    // Trigger file input click
    document.getElementById('fileInput').click();
  };

  useEffect(() => {
    // Fetch the latest uploaded image on component mount
    fetchLatestImage();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `banner/${file.name}`); // Use the "banner" folder

    uploadBytes(storageRef, file).then(() => {
      console.log('File uploaded successfully');
      // Fetch the latest image after successful upload
      fetchLatestImage();
    }).catch((error) => {
      console.error('Error uploading file:', error);
    });
  };

  return (
    <div>
      <h2>Banner</h2>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />
      <button onClick={handleUpdateImage}>Update Image</button>
      {imageUrl && (
        <div>
          <h3>Latest Uploaded Image</h3>
          <img src={imageUrl} alt="Latest Uploaded Image" style={{ maxWidth: '200px' }} />
        </div>
      )}
    </div>
  );
};

export default Banner;
