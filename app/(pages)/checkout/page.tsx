'use client'

import CheckOut from '@/component/CheckOut'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';

function Page() {
  
  const user = useSelector((state:any)=> state.auth.user);

  
  return (
    <div className='w-full h-screen'>
      <CheckOut/>
    </div>
  )
}

export default Page
