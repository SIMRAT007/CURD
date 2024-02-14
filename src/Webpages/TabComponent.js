import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, storage } from '../firebase-config'; // Adjust the path accordingly
import {  ref, listAll, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage functionalities

const TabComponent = () => {
  const [bankDetails, setBankDetails] = useState([]);
  const [activeTab, setActiveTab] = useState('Bank Details'); // State variable to track the active tab
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'bankdetails'));
        const bankData = [];
        querySnapshot.forEach((doc) => {
          bankData.push(doc.data());
        });
        setBankDetails(bankData);
      } catch (error) {
        console.error('Error fetching bank details:', error);
      }
    };
    fetchBankDetails();

    fetchLatestImage();
  }, []);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName); // Update the active tab when a tab is clicked
  };

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

  return (
    <div>
      {/* Tabs */}
      <div className="flex mb-4 ">
        <button
          className={`mr-4 px-4 py-2 rounded ${activeTab === 'Bank Details' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => handleTabClick('Bank Details')}
        >
          Bank Details
        </button>
        <button
          className={`mr-4 px-4 py-2 rounded ${activeTab === 'UPI IDs' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => handleTabClick('UPI IDs')}
        >
          UPI IDs
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'QR Code' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => handleTabClick('QR Code')}
        >
          QR Code
        </button>
      </div>

      {/* Content based on the active tab */}
      <div>
        {activeTab === 'Bank Details' && (
          <div>
            {/* Bank Details Content */}
            {bankDetails.map((bank, index) => (
              <div key={index} className="mb-4">
                <p><strong>Bank Name:</strong> {bank.bankName}</p>
                <p><strong>Account Number:</strong> {bank.accountNo}</p>
                <p><strong>IFSC Code:</strong> {bank.ifscCode}</p>
              </div>
            ))}
          </div>
        )}
        {/* UPI IDs Content */}
        {activeTab === 'UPI IDs' && (
          <div>
             {bankDetails.map((bank, index) => (
              <div key={index} className="mb-4">
                <p><strong>GPay ID:</strong> {bank.gpayId}</p>
                <p><strong>Number:</strong> {bank.number}</p>
                <p><strong>PhonePe ID:</strong> {bank.phonepayId}</p>
              </div>
            ))}
            {/* Add more UPI IDs here */}
          </div>
        )}
        {/* QR Code Content */}
        {activeTab === 'QR Code' && (
          <div className='w-full'>
            <div className="w-full  pt-5 mt-0">
              {isLoading ? (
                <p className='absolute'>Loading...</p>
              ) : (
                <>
                  {imageUrl ? (
                    <div>
                      <img src={imageUrl} alt="Latest Uploaded Image" className="max-w-xs mb-2 bg-white select-none m-auto " width='100px' />
                    </div>
                  ) : (
                    <p>No image available.</p>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabComponent;
