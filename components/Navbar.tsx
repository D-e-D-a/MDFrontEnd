import React from 'react'
import FloatingButtons from './FloatingButtons'

const Navbar = () => {
  return (
    <div className='flex sticky top-0 left-0 right-0 z-20 justify-between items-center px-6 py-4 bg-secondary h-20'>
        <FloatingButtons />
    </div>
  )
}

export default Navbar