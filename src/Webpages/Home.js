import React from 'react'
import Signup from './SignupPage'
import Login from './LoginPage'
import Proofs  from './Proofs'

const Home = () => {
  return (
    <>
    <div className='bg-yellow-500'>
    {/* <Signup/> */}
    </div>
    
    <div className='bg-red-500'>
   <Login/>
    </div>

    <div className='bg-green-500'>
   {/* <Proofs/> */}
    </div>

    </>
  )
}

export default Home