
import CheckOut from '@/component/CheckOut'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';

function page() {       
  return (
    <div className='w-full h-screen'>
      <CheckOut/>
    </div>
  )
}

export default page
