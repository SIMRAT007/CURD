import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase-config'; // Import Firebase Firestore instance

const UserDetails = () => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Query the "users" collection
        const usersQuery = query(collection(db, 'users'));
        // Get all documents in the collection
        const querySnapshot = await getDocs(usersQuery);
        // Extract the data from each document
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Set the user data in state
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Call the fetchUserData function on component mount
    fetchUserData();
  }, []);

  const handleStatusChange = async (userId, status) => {
    try {
      // Update the status of the user in Firestore
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { status });
      // Update the status in the local state
      setUserData(prevData =>
        prevData.map(user => (user.id === userId ? { ...user, status } : user))
      );
      console.log('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div>
      <h2>User Details</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Number</th>
            <th>Status</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {userData.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.name}</td>
              <td>{user.number}</td>
              <td>
                <select
                  value={user.status}
                  onChange={(e) => handleStatusChange(user.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </td>
              <td>
                {user.imageUrl && (
                  <img src={user.imageUrl} alt="User Image" style={{ width: '100px', height: '100px' }} />
                )}
              </td>
              <td>
                {/* You can add additional action buttons here */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserDetails;
