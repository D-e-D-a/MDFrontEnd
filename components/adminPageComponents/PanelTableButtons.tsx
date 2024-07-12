'use client';
import React from 'react';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const PanelTableButtons = ({ className }: { className?: string }) => {
  return (
    <div className={cn('absolute right-2 top-2 flex gap-2', className)}>
      <Link href="/admin" className={buttonVariants()}>
        Sjednice
      </Link>
      <Link href="/admin/questions" className={buttonVariants()}>
        Pitanja
      </Link>
      <Link href="/admin/users" className={buttonVariants()}>
        Korisnici
      </Link>
    </div>
  );
};

export default PanelTableButtons;
