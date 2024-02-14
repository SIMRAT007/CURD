import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase-config'; // Import Firebase auth and firestore instance
import { signOut } from 'firebase/auth';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Create user with email and password
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      // Add additional user data to Firestore collection
      await addDoc(collection(db, 'users'), { email, name, number, status: false, userId: user.uid });
      // Reset form fields and error state
      setEmail('');
      setPassword('');
      setName('');
      setNumber('');
      setError('');
      // Redirect to dashboard or another page upon successful signup
      // You can use React Router for navigation
alert('SIGNIN SUCCESSFULLY, PLEASE LOGIN NOW !')
      await signOut(auth);

      
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSignup} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
  <div className="mb-4">
    <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
    <input
      type="email"
      id="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
      className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>
  <div className="mb-4">
    <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
    <input
      type="password"
      id="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>
  <div className="mb-4">
    <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name</label>
    <input
      type="text"
      id="name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      required
      className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>
  <div className="mb-4">
    <label htmlFor="number" className="block text-gray-700 font-bold mb-2">Number</label>
    <input
      type="text"
      id="number"
      value={number}
      onChange={(e) => setNumber(e.target.value)}
      required
      className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>
  <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Signup</button>
  {error && <p className="text-red-500 mt-2">{error}</p>}
</form>

    </div>
  );
};

export default Signup;
