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
      alert('Invalid email or number, Please enter valid ids')
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
          alert("Image is uploaded successfully");
          
        }).catch((error) => {
          console.error('Error linking image URL to user ID:', error);
          alert('Error linking image URL to user ID:', error);
        });
      }).catch((error) => {
        console.error('Error getting download URL:', error);
      });
    }).catch((error) => {
      console.error('Error uploading file:', error);
      alert('Error uploading file:')
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className=' border-2  p-2'>
      <h2 className='text-center border-b pb-1 mb-3'>Upload Payment Proof</h2>
      <div>
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className='bg-gray-700 w-full mb-1 p-1' />
      </div>
      <div>
        <input type="text" placeholder="Number" value={number} onChange={(e) => setNumber(e.target.value)} className='bg-gray-700 w-full mb-1 p-1' />
      </div>
      <div className='text-center'>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <div>
        <button onClick={handleUpload} className='bg-green-600 mt-2 ml-2 px-5 rounded text-white '>Upload</button>
        {/* <p>{error}</p> */}
      </div>
      {/* {error && <p>{error}</p>}
      {imageUrl && <img src={imageUrl} alt="Uploaded Image" style={{ maxWidth: '200px' }} />} */}
    </div>
  );
};

export default Proofs;
