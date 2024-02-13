import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase-config'; // Adjust the path accordingly
import { getDocs, collection, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';

const BankDetails = () => {
  const [bankDetails, setBankDetails] = useState([]);
  const [updatedDetails, setUpdatedDetails] = useState({
    name: '',
    number: '',
    bankName: '',
    accountNo: '',
    ifscCode: '',
    gpayId: '',
    phonepayId: '',
  });

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'bankdetails'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBankDetails(data);
        // Autofill input fields with the fetched data (assuming there's only one document in the collection)
        if (data.length > 0) {
            const details = data[0]; // Assuming there's only one document
            setUpdatedDetails({
              name: details.name || '',
              number: details.number || '',
              bankName: details.bankName || '',
              accountNo: details.accountNo || '',
              ifscCode: details.ifscCode || '',
              gpayId: details.gpayId || '',
              phonepayId: details.phonepayId || '',
            });}
      } catch (error) {
        console.error('Error fetching bank details:', error);
      }
    };
    fetchBankDetails();
  }, []);

  const handleUpdate = async (id) => {
    try {
      const bankDocRef = doc(db, 'bankdetails', id);
      
      // Update the document with the new values
      await updateDoc(bankDocRef, updatedDetails);

      // Refresh bank details after update
      const updatedBankDetails = bankDetails.map(detail => {
        if (detail.id === id) {
          return {
            ...detail,
            ...updatedDetails
          };
        }
        return detail;
      });
      setBankDetails(updatedBankDetails);


      console.log('Bank details updated successfully');
    } catch (error) {
      console.error('Error updating bank details:', error);
    }
  };




//   ----------------IMAGE-------------------

const [image, setImage] = useState(null);
const [imageUrl, setImageUrl] = useState('');
const [isLoading, setIsLoading] = useState(true);

// Function to fetch the latest image URL
const fetchLatestImage = () => {
  setIsLoading(true);
  // List all files in the storage
  listAll(ref(storage)).then((res) => {
    // Get the last file in the list (assuming it's the latest uploaded)
    const latestFile = res.items[res.items.length - 1];
    // Get the download URL of the latest file
    getDownloadURL(latestFile).then((url) => {
      setImageUrl(url);
      setIsLoading(false);
    });
  }).catch((error) => {
    console.error('Error fetching latest image:', error);
    setIsLoading(false);
  });
};

// Function to handle image upload
const handleImageUpload = (e) => {
  const file = e.target.files[0];
  const storageRef = ref(storage, file.name);

  uploadBytes(storageRef, file).then(() => {
    console.log('File uploaded successfully');
    // Fetch the latest image after successful upload
    fetchLatestImage();
  }).catch((error) => {
    console.error('Error uploading file:', error);
  });
};

// useEffect hook to fetch latest image URL on component mount
useEffect(() => {
  fetchLatestImage();
}, []);

  return (
    <div>
      <h2>Bank Details</h2>
      <ul>
        {bankDetails.map((detail) => (
          <li key={detail.id}>
            <strong>Name:</strong> {detail.name}, <strong>Number:</strong> {detail.number},
            <strong>Bank Name:</strong> {detail.bankName}, <strong>Account No:</strong> {detail.accountNo},
            <strong>IFSC Code:</strong> {detail.ifscCode}, <strong>GPay ID:</strong> {detail.gpayId},
            <strong>PhonePe ID:</strong> {detail.phonepayId},
            {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {imageUrl ? (
            <div>
              <h3>Latest Uploaded Image</h3>
              <img src={imageUrl} alt="Latest Uploaded Image" style={{ maxWidth: '200px' }} />
            </div>
          ) : (
            <p>No image available.</p>
          )}
        </>
      )}
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          placeholder="Enter name"
          value={updatedDetails.name}
          onChange={(e) => setUpdatedDetails({...updatedDetails, name: e.target.value})}
        />
        <input
          type="text"
          placeholder="Enter number"
          value={updatedDetails.number}
          onChange={(e) => setUpdatedDetails({...updatedDetails, number: e.target.value})}
        />
        <input
          type="text"
          placeholder="Enter bank name"
          value={updatedDetails.bankName}
          onChange={(e) => setUpdatedDetails({...updatedDetails, bankName: e.target.value})}
        />
        <input
          type="text"
          placeholder="Enter account number"
          value={updatedDetails.accountNo}
          onChange={(e) => setUpdatedDetails({...updatedDetails, accountNo: e.target.value})}
        />
        <input
          type="text"
          placeholder="Enter IFSC code"
          value={updatedDetails.ifscCode}
          onChange={(e) => setUpdatedDetails({...updatedDetails, ifscCode: e.target.value})}
        />
        <input
          type="text"
          placeholder="Enter GPay ID"
          value={updatedDetails.gpayId}
          onChange={(e) => setUpdatedDetails({...updatedDetails, gpayId: e.target.value})}
        />
        <input
          type="text"
          placeholder="Enter PhonePe ID"
          value={updatedDetails.phonepayId}
          onChange={(e) => setUpdatedDetails({...updatedDetails, phonepayId: e.target.value})}
        />
        
        <button onClick={() => handleUpdate(bankDetails[0].id)} >Update</button>


        {/* IMAGE  */}

        <input
        id="fileInput"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />

<button onClick={() => document.getElementById('fileInput').click()}>Update Image</button>
      </div>
    </div>
  );
};

export default BankDetails;
