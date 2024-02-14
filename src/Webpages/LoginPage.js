import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase-config'; // Adjust the path accordingly

{/* HOME SCREEN  */}
{/* <iframe src='https://goldbox247.com/#/home' className=' absolute top-0 w-full h-[100%]'>

</iframe> */}

const Login = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Set current user in state
      if (user) {
        // Fetch user details from Firestore when user is logged in
        fetchUserDetails(user.email);
      } else {
        // Clear user details when user is logged out
        setUserDetails(null);
        // Clear user details from local storage
        localStorage.removeItem('userDetails');
      }
    });

    // Check if user details are stored in local storage
    const storedUserDetails = localStorage.getItem('userDetails');
    if (storedUserDetails) {
      setUserDetails(JSON.parse(storedUserDetails));
    }

    return () => unsubscribe(); // Unsubscribe from auth state changes on component unmount
  }, []);

  const fetchUserDetails = async (email) => {
    try {
      const userQuery = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setUserDetails(userData);
        // Store user details in local storage
        localStorage.setItem('userDetails', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    // Check if a user is already logged in
    const currentUser = auth.currentUser;
    if (currentUser) {
      // Prompt the user to log out before logging in again
      setError('Another user is already logged in. Please log out before logging in again.');
      return;
    }

    // Sign in user with email and password
    await signInWithEmailAndPassword(auth, email, password);
    console.log('Login successful');
    alert("LOGIN SUCCESSFULL");

    // Fetch user details from Firestore
    const userQuery = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(userQuery);
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      setUserDetails(userData);

      // Invoke onSuccess callback after successful login
    onSuccess(userData);
    } else {
      console.log('User not found in database');
    }
 // Fetch user data here

    // Reset email and password fields and clear error
    setEmail('');
    setPassword('');
    setError('');

    
  } catch (error) {
    setError(error.message);
    console.error('Login error:', error);
  }
};

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out user
      setUserDetails(null); // Clear user details from state
      // Clear user details from local storage
      localStorage.removeItem('userDetails');
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin} className="max-w-md mx-auto bg-white p-8 rounded-md shadow-md">
  <div className="mb-4">
    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
    <input
      type="email"
      id="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
    />
  </div>
  <div className="mb-4">
    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
    <input
      type="password"
      id="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
    />
  </div>
  <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50">Login</button>
  {error && <p className="mt-2 text-red-600">{error}
  </p>}

  {/* <button onClick={handleLogout}>Logout</button> */}
</form>

      {userDetails && (
        <div>
          <h3>User Details</h3>
          <p><strong>Name:</strong> {userDetails.name}</p>
          <p><strong>Number:</strong> {userDetails.number}</p>
          <p><strong>Email:</strong> {userDetails.email}</p>
          <p style={{ backgroundColor: userDetails.status === 'true' ? 'green' : userDetails.status === 'pending' ? 'yellow' : 'red' }}>
            <strong>Status:</strong> {userDetails.status}
          </p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
      {/* {error && <p>{error}</p>} */}
    </div>
  );
};

export default Login;
