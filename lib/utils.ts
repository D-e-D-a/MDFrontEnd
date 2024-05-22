import { type ClassValue, clsx } from 'clsx'; // Importing clsx for merging classnames
import { twMerge } from 'tailwind-merge'; // Importing twMerge for merging Tailwind classes

// Function to merge and combine class names using clsx and tailwind-merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs)); // Merge and combine class names
}

// Function to toggle password visibility
export const togglePasswordVisibility = () => {
  const passwordInput = document.getElementById('password') as HTMLInputElement;
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text'; // Change input type to text to show password
  } else {
    passwordInput.type = 'password'; // Change input type to password to hide password
  }
};

// Function to prevent pasting into the password field
export const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
  event.preventDefault(); // Prevent default paste action
};

export const handleLogOut = () => {
  sessionStorage.removeItem('user');
  document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  window.location.reload();
};
