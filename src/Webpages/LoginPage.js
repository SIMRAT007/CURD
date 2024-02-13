import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase-config'; // Adjust the path accordingly

const Login = () => {
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
      await signOut(auth);
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
  
      // Fetch user details from Firestore
      fetchUserDetails(email);
  
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
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
      <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
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
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
