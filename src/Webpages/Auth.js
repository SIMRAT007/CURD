import React, { useState } from 'react';
import Login from './LoginPage';
import Signup from './SignupPage';

const Auth = () => {
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleTabToggle = (isLogin) => {
    setIsLoginActive(isLogin);
  };

  const handleSuccessfulLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-gray-100 p-8 rounded-lg ">
        <div className="flex mb-4 w-fit m-auto ">
          <button
            onClick={() => handleTabToggle(true)}
            className={`px-4 py-2 mr-4 ${isLoginActive ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'} rounded-md focus:outline-none focus:bg-blue-600 `}
          >
            Login
          </button>
          <button
            onClick={() => handleTabToggle(false)}
            className={`px-4 py-2 ${!isLoginActive ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'} rounded-md focus:outline-none focus:bg-blue-600`}
          >
            Signup
          </button>
        </div>
        {isLoginActive ? (
          <div className='border-t-2 border-gray-400'>
            <h2 className="text-2xl mb-4 text-center uppercase border-b-2 border-gray-400 py-3">Login</h2>
            <Login onSuccess={handleSuccessfulLogin} />
          </div>
        ) : (
          <div className='border-t-2 border-gray-400'>
            <h2 className="text-2xl mb-4 text-center uppercase border-b-2 border-gray-400 py-3">Signup</h2>
            <Signup onSuccess={() => handleTabToggle(true)} />
          </div>
        )}
        {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
      </div>
    </div>
  );
};

export default Auth;
