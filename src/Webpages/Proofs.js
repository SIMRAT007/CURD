import React, { useState } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db, storage } from '../firebase-config'; // Import Firebase Firestore instance
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage functions

const Proofs = () => {
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  const handleUpload = async () => {
    // Validate email and number against the database of users
    const userQuery = query(collection(db, 'users'), where('email', '==', email), where('number', '==', number));
    const querySnapshot = await getDocs(userQuery);
    if (querySnapshot.empty) {
      setError('Invalid email or number');
      return;
    }
  
    // If email and number are valid, upload the image to "proofs" folder
    const file = image;
    const storageRef = ref(storage, 'proofs/' + file.name); // Adjust path to "proofs" folder
    uploadBytes(storageRef, file).then(() => {
      console.log('File uploaded successfully');
      // Get the download URL of the uploaded image
      getDownloadURL(storageRef).then((url) => {
        setImageUrl(url);
        // Link the image URL to the user's ID in the database
        const userId = querySnapshot.docs[0].id;
        const userRef = doc(db, 'users', userId);
        updateDoc(userRef, { imageUrl: url }).then(() => {
          console.log('Image URL linked to user ID successfully');
        }).catch((error) => {
          console.error('Error linking image URL to user ID:', error);
        });
      }).catch((error) => {
        console.error('Error getting download URL:', error);
      });
    }).catch((error) => {
      console.error('Error uploading file:', error);
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div>
      <h2>Upload Image</h2>
      <div>
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <input type="text" placeholder="Number" value={number} onChange={(e) => setNumber(e.target.value)} />
      </div>
      <div>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <div>
        <button onClick={handleUpload}>Upload Image</button>
      </div>
      {error && <p>{error}</p>}
      {imageUrl && <img src={imageUrl} alt="Uploaded Image" style={{ maxWidth: '200px' }} />}
    </div>
  );
};

export default Proofs;
