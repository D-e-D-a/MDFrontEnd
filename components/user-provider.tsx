'use client';
import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { RegisterResponseProps } from '@/lib/types';

// Define the shape of the context value
interface UserContextProps {
  user: RegisterResponseProps | null; // User type imported from '@/lib/types'
  setUser: React.Dispatch<React.SetStateAction<RegisterResponseProps | null>>;
  error: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  id?: number;
  token: string;
  questions?: any[];
  setQuestions?: React.Dispatch<React.SetStateAction<any | undefined>>;
  isAdmin?: boolean;
  setIsAdmin?: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context
export const UserContext = createContext<UserContextProps | null>(null);

// Create the provider component
export default function UserProvider({ children }: PropsWithChildren<{}>) {
  // Define state for user and isLoading
  const [user, setUser] = useState<RegisterResponseProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [token, setToken] = useState('');
  const [error, setError] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    const storedToken = document.cookie.split('; ').find((row) => row.startsWith('token='));
    setToken(storedToken?.split('=')[1] || '');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false); // Change isLoading to false after retrieving user data
  }, []);

  useEffect(() => {
    user?.data.data.user.role === 'ADMIN' && setIsAdmin(true);
  }, [user]);
  

  // Define the value to be passed to the context provider
  const value: UserContextProps = {
    user,
    setUser,
    isLoading,
    id,
    token,
    error,
    setError,
    questions,
    setQuestions,
    isAdmin,
    setIsAdmin,

    setIsLoading,
  };

  // Render the provider with the value and children
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useAuth() {
  // Access the context
  const context = useContext(UserContext);

  // Check if the context exists
  if (!context) {
    throw new Error('useAuth must be used within a UserProvider');
  }

  // Return the context
  return context;
}
