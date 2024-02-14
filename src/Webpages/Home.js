import React, { useState, useEffect } from 'react';
import Login from './LoginPage';
import Signup from './SignupPage'; 
import Proofs from './Proofs'
import { signOut } from 'firebase/auth'; // Import the signOut method from Firebase Authentication
import { auth,db } from '../firebase-config'; // Adjust the path accordingly
import TabComponent from './TabComponent';
import Logo from '../images/logo.gif'
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';

const Home = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [mode, setMode] = useState('login'); // State variable to track the current mode
  const [detailsOpen, setDetailsOpen] = useState(false); // State variable to track if the "Details" popup is open

  const handleModalClose = () => {
    // Close the modal only if the background overlay is clicked
    setIsOpen(false);
  };

  const handleLoginSuccess = (userData) => {
    setUserDetails(userData);
    setIsOpen(false); // Close the modal after successful login
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserDetails(user);
        const unsubscribeUserDetails = fetchUserDetails(user.email);
        return () => unsubscribeUserDetails(); // Unsubscribe when the component unmounts
      } else {
        setUserDetails(null);
      }
    });
  
    return () => unsubscribe(); // Unsubscribe from the auth state listener when the component unmounts
  }, []);
  



  const handleLogout = async () => {
    try {
      // Sign out the user from Firebase Authentication
      await signOut(auth);
      alert("LOGOUT SUCCESSFULL");

      // Clear user details after logout
      setUserDetails(null);

      // Reopen the login popup after logout
      setIsOpen(true);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSwitchMode = () => {
    // Switch between login and signup modes
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  const handleDetailsOpen = () => {
    // Open the "Details" popup
    setDetailsOpen(true);
  };

  const handleDetailsClose = () => {
    // Close the "Details" popup
    setDetailsOpen(false);
  };




  const fetchUserDetails = (email) => {
    try {
      const userQuery = query(collection(db, 'users'), where('email', '==', email));
      const unsubscribe = onSnapshot(userQuery, (querySnapshot) => {
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setUserDetails(userData);
        }
      });
      return unsubscribe; // Return the unsubscribe function to be called later
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen">
      {/* Background Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-50" // Close the modal only if the background overlay is clicked
        ></div>
      )}

      {/* Popup Modal */}
      <div className={`fixed bg-white p-8 rounded-lg shadow-lg z-50 ${isOpen ? 'block' : 'hidden'}`}>
        <h2 className="text-2xl font-bold mb-4 text-center">{mode === 'login' ? 'LOGIN' : 'SIGNUP'}</h2>

        {/* Conditionally render Login or Signup component based on the mode */}
        {mode === 'login' ? (
          <Login onSuccess={handleLoginSuccess} />
          
        ) : (
          <Signup onSuccess={handleLoginSuccess} />
        )}

        {/* Button to switch between login and signup modes */}
        <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleSwitchMode}>
          Switch to {mode === 'login' ? 'Signup' : 'Login'}
        </button>

        <button className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={handleModalClose}>Close</button>
      </div>



{/* HOME SCREEN  */}

<iframe src='https://goldbox247.com/#/home' className='w-full h-[100%] absolute'>



</iframe>

<div className='bg-black w-full h-[70px] absolute top-0 left-0'>
  <img src={Logo} alt='Logo' className='w-[15%] absolute top-0 left-10'/>

   {/* Button to open the popup */}
   <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute right-10 top-4" onClick={() => setIsOpen(!isOpen)}>LOGIN | SIGNUP</button>

{userDetails && (
  <div className=' absolute top-4 right-[16%] text-white'>
    
     {/* Button to open the "Details" popup */}
    <button onClick={handleDetailsOpen} className='py-2 px-5 bg-red-600 rounded mr-5'>&#x1F3E6; Deposit</button>
 {/* Button to open the logout */}
    <button onClick={handleLogout} className='py-2 px-5 bg-red-600 rounded '>Logout</button>
   
  </div>
)}
</div>


{/* END HOME SCREEN  */}




     

      {/* "Details" Popup */}
      {detailsOpen && (
        <div className='bg-[#000000a9]  w-full h-[100%] relative top-0 flex items-center overflow-y-scroll justify-center'>
          
        <div className="absolute bg-white p-8 rounded-lg shadow-2xl z-50 m-auto ">
          <TabComponent/>
          <Proofs/>
          <h1 className="text-xl font-bold mb-4 text-center border-t mt-3">User Details</h1>
          {userDetails && (
            <div className='text-black'>
              <p ><strong>Name:</strong> {userDetails.name}</p>
              <p><strong>Number:</strong> {userDetails.number}</p>
              <p><strong>Email:</strong> {userDetails.email}</p>
              <p className='text-black' style={{ backgroundColor: userDetails.status === 'true' ? 'green' : userDetails.status === 'pending' ? 'yellow' : 'red' }}>
                <strong>Status:</strong> {userDetails.status}
              </p>
            </div>
          )}
          <button onClick={handleDetailsClose} className=' absolute top-0 right-[-40px] bg-red-500 px-2 rounded-full border-2 text-white'>X</button>
        </div></div>
      )}
      
    </div>
  );
};

export default Home;
