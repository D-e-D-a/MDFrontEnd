'use client';
import React, { useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button, buttonVariants } from './ui/button';
import Link from 'next/link';
import axios from 'axios';
import { registerUser } from '@/lib/apiCalls';

export default function CreateAcc() {
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [createdSuccessfully, setCreatedSuccessfully] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const enteredEmail = data.get('email') as string;
    const enteredPassword = data.get('password') as string;
    const enteredFirstName = data.get('first-name') as string;
    const enteredLastName = data.get('last-name') as string;
    const enteredUsername = data.get('username') as string;
    const enteredConfirmPassword = data.get('confirm-password') as string;

    if (enteredPassword !== enteredConfirmPassword) {
      setPasswordMatchError('Passwords do not match');
      return;
    }

    try {
      const userDetails = {
        firstName: enteredFirstName,
        lastName: enteredLastName,
        email: enteredEmail,
        username: enteredUsername,
        password: enteredPassword,
        role: 'USER',
      };
      const response = await registerUser(userDetails);
      console.log(response); // Assuming your API returns some data
      response.data.status === 'Success' && setCreatedSuccessfully(true);
      // Optionally, you can redirect the user or perform other actions based on the response
    } catch (error) {
      console.error('Error:', error);
      // Handle the error here (display a message to the user, redirect, etc.)
    }
  };
  return (
    <>
      {createdSuccessfully ? (
        <div className="flex flex-col  gap-2 items-center justify-center h-screen w-full  border">
          <p className="text-3xl">Uspesno ste napravili nalog!!!</p>
          <Link href="/login" className={`${buttonVariants()}  `}>
            Login
          </Link>
        </div>
      ) : (
        <section className="max-w-2xl w-full">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <p className="text-primary">Dobro dosli na sajt za glasanje</p>
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Napravite nalog
                </h1>
                <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                  <div className="flex gap-4">
                    <div>
                      <Label htmlFor="first-name">Your First Name</Label>
                      <Input
                        type="text"
                        name="first-name"
                        id="first-name"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="last-name">Your Last Name</Label>
                      <Input
                        type="text"
                        name="last-name"
                        id="last-name"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <Label htmlFor="email">Your email</Label>
                      <Input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="name@gmail.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="username">Your username</Label>
                      <Input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="john_doe"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm password</Label>
                    <Input
                      type="password"
                      name="confirm-password"
                      id="confirm-password"
                      placeholder="••••••••"
                      required
                    />
                    {passwordMatchError && (
                      <p className="text-red-500 text-sm">{passwordMatchError}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full text-white">
                    Create an account
                  </Button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Already have an account?
                    <Link href="/login" className={`${buttonVariants({ variant: 'link' })} pl-0.5`}>
                      Login here
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
