import Voting from '@/components/Voting';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

export default async function Results() {
  return (
    <div className='flex items-center justify-center h-screen'>
      <h1>Please vote first on <Link href={'/home'} className={buttonVariants({ variant: 'link' })}>home</Link> page before coming here </h1>
     
    </div>
  );
}
