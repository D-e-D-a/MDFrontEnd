'use client';
import React from 'react';
import FloatingButtons from './FloatingButtons';
import { useAuth } from './user-provider';

const Navbar = () => {
  const { token } = useAuth();
  return (
    <div
      className={`${
        token ? 'block' : 'hidden'
      } flex sticky top-0 left-0 right-0 z-20 justify-between items-center px-6 py-4 bg-secondary h-20`}
    >
      <FloatingButtons />
    </div>
  );
};

export default Navbar;
