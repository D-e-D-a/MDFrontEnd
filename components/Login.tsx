'use client';
import React, { useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Eye, Loader, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { handlePaste, togglePasswordVisibility } from '@/lib/utils';
import { loginUser } from '@/lib/apiCalls';
import { useAuth } from './user-provider';

const Login = () => {
  const router = useRouter(); // Initialize router for navigation
  const [loggedIn, setLoggedIn] = useState(false);
  const { error, setError, setUser, setIsAdmin } = useAuth();

  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    const data = new FormData(event.currentTarget);
    const enteredUsername = data.get('username') as string;
    const enteredPassword = data.get('password') as string;

    try {
      const response = await loginUser(enteredUsername, enteredPassword);

      if (response.data.status === 'Success') {
        setUser(response);
        sessionStorage.setItem('user', JSON.stringify(response));

        // Set session cookies without specifying expires or max-age
        document.cookie = `token=${response.data.token}; path=/; SameSite=Strict`;
        document.cookie = `isAdmin=${
          response.data.data.user.role === 'ADMIN'
        }; path=/; SameSite=Strict`;

        // Update the loggedIn state after redirecting
        setLoggedIn(true);

        // Redirect to home page if authentication is successful
        router.push('/home');
      } else {
        console.log('Incorrect email or password');
      }
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  return (
    <section className="max-w-2xl w-full">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <p className="text-primary">Dobro dosli na sajt za glasanje</p>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Ulogujte se na sajt
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your username
                </Label>
                <Input
                  type="username"
                  name="username"
                  id="username"
                  placeholder="john_doe"
                  required
                />
              </div>
              <div className="relative">
                <Label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  required
                  // onPaste={handlePaste}
                />{' '}
                <Eye
                  className="absolute  right-2 top-10  h-4 w-4 text-white cursor-pointer"
                  onClick={togglePasswordVisibility}
                />
              </div>
              {error && <p className="text-red-500">Incorrect username or password</p>}

              <Button type="submit" className="w-full px-5 text-white">
                {loggedIn ? (
                  <Loader className="ml-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Log in <LogIn className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
