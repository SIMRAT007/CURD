import { useState } from 'react';
import BankDetails from './Dashboard/BankDetails';
import Banner from './Dashboard/Banner';
import UserDetails from './Dashboard/UserDetails';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('bank');

  return (
    <div className="flex ">
      {/* Side Navigation */}
      <div className="w-[400px] bg-gray-800 ">
        <div className="flex flex-col justify-center h-full">
          <button
            className={`py-4 px-6 hover:bg-gray-700 ${activeTab === 'bank' ? 'bg-gray-700 text-white' : 'text-gray-300'}`}
            onClick={() => setActiveTab('bank')}
          >
            Bank Details
          </button>
          <button
            className={`py-4 px-6 hover:bg-gray-700 ${activeTab === 'user' ? 'bg-gray-700 text-white' : 'text-gray-300'}`}
            onClick={() => setActiveTab('user')}
          >
            User Details
          </button>
          <button
            className={`py-4 px-6 hover:bg-gray-700 ${activeTab === 'banner' ? 'bg-gray-700 text-white' : 'text-gray-300'}`}
            onClick={() => setActiveTab('banner')}
          >
            Banner Change
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full p-8 overflow-x-hidden h-screen">
        {activeTab === 'bank' && (
          <div>
            {/* Bank Details Component */}
            <h2 className="text-2xl font-bold mb-4">Bank Details</h2>
            {/* Add bank details component here */}
            <div className='w-full mt-10'>
                <BankDetails/>
            </div>
          </div>
        )}
        {activeTab === 'user' && (
          <div>
            {/* User Details Component */}
            <h2 className="text-2xl font-bold mb-4">User Details</h2>
            {/* Add user details component here */}
            <div className='w-full bg-gray-800  mt-10'>
                <UserDetails/>
            </div>
          </div>
        )}
        {activeTab === 'banner' && (
          <div>
            {/* Banner Change Component */}
            <h2 className="text-2xl font-bold mb-4">Banner Change</h2>
            {/* Add banner change component here */}
            <div className='w-full bg-gray-800  mt-10'>
                <Banner/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
