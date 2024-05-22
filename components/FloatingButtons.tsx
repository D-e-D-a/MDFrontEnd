'use client';
import React from 'react';
import { ThemeToggle } from './theme-toggle';
import { useAuth } from './user-provider';
import Link from 'next/link';
import { Button, buttonVariants } from './ui/button';
import { LogOut, User2 } from 'lucide-react';
import { handleLogOut } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const FloatingButtons = () => {
  const { isAdmin } = useAuth();
  return (
    <div className="absolute top-5 right-5 flex items-center gap-6">
      <Link href="/home" className={buttonVariants({ variant: 'outline' })}>
        Home
      </Link>

      {isAdmin && (
        <Link href="/admin" className={buttonVariants({ variant: 'outline' })}>
          Admin panel
        </Link>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline"> <User2 className=" h-4 w-4" /></Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit flex flex-col gap-5">
          <ThemeToggle />
          {/* <Link href='/account' className={buttonVariants()}>My account</Link> */}
          <Button onClick={handleLogOut}>
            Logout <LogOut className="ml-2 h-4 w-4" />
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FloatingButtons;
