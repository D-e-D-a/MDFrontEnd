'use client';
import React from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Input } from './ui/input';
import { updateUser } from '@/lib/apiCalls';
import { useAuth } from './user-provider';

const UserAcc = () => {
  const { token } = useAuth();
  const handleUpdateUserDetails = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('🚀 ~ file: UserAcc.tsx:handleSubmit ~ event:', event);
    const data = new FormData(event.currentTarget);
    const enteredEmail = data.get('email') as string;
    const enteredFirstName = data.get('firstName') as string;
    const enteredLastName = data.get('lastName') as string;
    // updateUser(token, enteredEmail, enteredFirstName, enteredLastName);
  };
  return (
    <div>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Updejtuj podatke</CardTitle>
          <CardDescription>Promijenite ime i prezime ili email</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateUserDetails}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="email">Email adresa</label>
                <Input id="email" placeholder="Email" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="firstName">Ime</label>
                <Input id="firstName" placeholder="First Name" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="lastName">Prezime</label>
                <Input id="lastName" placeholder="Last Name" />
              </div>
            </div>
            <CardFooter className="flex justify-center  items-end p-0 pt-6">
              <Button type="submit">Updejtuj</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAcc;
