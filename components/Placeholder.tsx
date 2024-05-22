import { Loader } from 'lucide-react';
import React from 'react';

const Placeholder = () => {
  return (
    <div className='flex h-screen w-full items-center justify-center'>
      Loading <Loader className="ml-2 h-4 w-4 animate-spin" />
    </div>
  );
};

export default Placeholder;
