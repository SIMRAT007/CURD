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
    // Sort the list of files by their creation time in descending order
    const sortedFiles = res.items.sort((a, b) => b.timeCreated - a.timeCreated);
    // Get the top-most (latest) file
    const latestFile = sortedFiles[0];
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
    <>
    <div className='w-full flex gap-2 flex-row-reverse '>

      {/* 1st box */}

      <div className='w-full bg-gray-800 p-5 px-5'>
        <h2 className='text-white pb-4 border-b text-center font-bold'>YOUR DATA</h2>
      <ul className="divide-y divide-gray-200 text-white">
  {bankDetails.map((detail) => (
    <li key={detail.id} className="py-4">
      <div className="flex flex-wrap ">
        <div className="w-full sm:w-1/2 pb-5 pt-0 relative pr-5 ">
          <strong className="block mb-1">Name</strong>
          <span className='bg-gray-600 w-[80%] absolute px-2 py-1 rounded-lg select-none'>{detail.name}</span>
        </div>
        <div className="w-full sm:w-1/2  pb-5 pt-0 relative pr-5">
          <strong className="block mb-1">Number</strong>
          <span className='bg-gray-600 w-[80%] absolute px-2 py-1 rounded-lg select-none'>{detail.number}</span>
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="w-full sm:w-1/2  pb-5 pt-5 relative pr-5 mt-5">
          <strong className="block mb-1">Bank Name</strong>
          <span className='bg-gray-600 w-[80%] absolute px-2 py-1 rounded-lg select-none'>{detail.bankName}</span>
        </div>
        <div className="w-full sm:w-1/2 pb-5 pt-5 relative pr-5 mt-5">
          <strong className="block mb-1">Account No</strong>
          <span className='bg-gray-600 w-[80%] absolute px-2 py-1 rounded-lg select-none'>{detail.accountNo}</span>
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="w-full sm:w-1/2 pb-5 pt-5 relative pr-5 mt-5">
          <strong className="block mb-1">IFSC Code</strong>
          <span className='bg-gray-600 w-[80%] absolute px-2 py-1 rounded-lg select-none'>{detail.ifscCode}</span>
        </div>
        <div className="w-full sm:w-1/2 pb-5 pt-5 relative pr-5 mt-5">
          <strong className="block mb-1">GPay ID</strong>
          <span className='bg-gray-600 w-[80%] absolute px-2 py-1 rounded-lg select-none'>{detail.gpayId}</span>
        </div>
      </div>
      <div className="flex flex-wrap ">
        <div className="w-full sm:w-1/2 pb-5 pt-5 relative pr-5 mt-5">
          <strong className="block mb-1">PhonePe ID</strong>
          <span className='bg-gray-600 w-[80%] absolute px-2 py-1 rounded-lg select-none'>{detail.phonepayId}</span>
        </div>
        <div className="w-full sm:w-1/2 pt-5 mt-5">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              {imageUrl ? (
                <div>
                  <h3 className="mt-2">QR CODE</h3>
                  <img src={imageUrl} alt="Latest Uploaded Image" className="max-w-xs mt-1 bg-white select-none" width='200px' />
                </div>
              ) : (
                <p>No image available.</p>
              )}
            </>
          )}
        </div>
      </div>
    </li>
  ))}
</ul>

      </div>

{/* 2nd box  */}
      <div className='w-full bg-gray-800 p-5'>
      <h2 className='text-white pb-4 border-b text-center font-bold mb-5'>UPDATE DATA</h2>
      <div className="space-y-4">
  <input
    type="text"
    placeholder="Enter name"
    value={updatedDetails.name}
    onChange={(e) => setUpdatedDetails({...updatedDetails, name: e.target.value})}
    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
  />
  <input
    type="text"
    placeholder="Enter number"
    value={updatedDetails.number}
    onChange={(e) => setUpdatedDetails({...updatedDetails, number: e.target.value})}
    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
  />
  <input
    type="text"
    placeholder="Enter bank name"
    value={updatedDetails.bankName}
    onChange={(e) => setUpdatedDetails({...updatedDetails, bankName: e.target.value})}
    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
  />
  <input
    type="text"
    placeholder="Enter account number"
    value={updatedDetails.accountNo}
    onChange={(e) => setUpdatedDetails({...updatedDetails, accountNo: e.target.value})}
    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
  />
  <input
    type="text"
    placeholder="Enter IFSC code"
    value={updatedDetails.ifscCode}
    onChange={(e) => setUpdatedDetails({...updatedDetails, ifscCode: e.target.value})}
    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
  />
  <input
    type="text"
    placeholder="Enter GPay ID"
    value={updatedDetails.gpayId}
    onChange={(e) => setUpdatedDetails({...updatedDetails, gpayId: e.target.value})}
    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
  />
  <input
    type="text"
    placeholder="Enter PhonePe ID"
    value={updatedDetails.phonepayId}
    onChange={(e) => setUpdatedDetails({...updatedDetails, phonepayId: e.target.value})}
    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
  />
  
  <button onClick={() => handleUpdate(bankDetails[0].id)} className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Update</button>

  <input
    id="fileInput"
    type="file"
    accept="image/*"
    style={{ display: 'none' }}
    onChange={handleImageUpload}
  />

  <button onClick={() => document.getElementById('fileInput').click()} className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400">Update Image</button>
</div>

      </div>

    </div>
    </>
  );
};

export default BankDetails;
