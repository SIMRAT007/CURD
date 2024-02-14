import React, { useState, useEffect } from 'react';
import ImageModal from './ImageModal';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase-config'; // Import Firebase Firestore instance

// Other imports...

const UserDetails = () => {
  const [userData, setUserData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersQuery = query(collection(db, 'users'));
        const querySnapshot = await getDocs(usersQuery);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleStatusChange = async (userId, status) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { status });
      setUserData(prevData =>
        prevData.map(user => (user.id === userId ? { ...user, status } : user))
      );
      console.log('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedImage('');
    setShowModal(false);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead className='text-white'>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Number</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Proof</th>
            </tr>
          </thead>
          <tbody className='text-center text-white border-spacing-3'>
            {userData.map(user => (
              <tr key={user.id} className='border-2 bg-gray-700'>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.number}</td>
                <td>
                  <select
                    value={user.status}
                    onChange={(e) => handleStatusChange(user.id, e.target.value)} className='text-gray-700'
                  >
                    <option value="pending">Pending</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </td>
                <td>
                  <div>
                    <button onClick={() => handleImageClick(user.imageUrl)} className='bg-blue-600 px-3 py-2 m-2 rounded-full text-white'>See Image</button>
                    {showModal && <ImageModal imageUrl={selectedImage} onClose={handleCloseModal} />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserDetails;

