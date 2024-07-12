'use client';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { deleteUser, getUsers, updateUser, updateUserPassword } from '@/lib/apiCalls';
import { useAuth } from '../user-provider';
import { User } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    getUsers(token).then((data) => {
      if (!data) return;
      setUsers(data.data.users);
    });
  }, [token]);

  return (
    <Table className="w-[80%] overflow-hidden border mx-auto">
      <TableCaption>A list of users</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Ime</TableHead>
          <TableHead>Prezime</TableHead>
          <TableHead>User Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Update</TableHead>
          <TableHead>Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{user.firstName}</TableCell>
            <TableCell>{user.lastName}</TableCell>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="hover:bg-blue-500">
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Izmijenite profil</DialogTitle>
                    <DialogDescription>Izmijenite podatke o profilu</DialogDescription>
                  </DialogHeader>
                  <div>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <label htmlFor="firstName">Ime</label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <label htmlFor="lastName">Prezime</label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <label htmlFor="email">Email adresa</label>
                        <Input
                          id="email"
                          placeholder="john@doe"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <label>Role korisnika</label>
                        <Select onValueChange={(e) => setRole(e)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select role for a user" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="ADMIN">ADMIN</SelectItem>
                              <SelectItem value="USER">USER</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <label htmlFor="oldPassword">Old Password</label>
                        <Input
                          id="oldPassword"
                          placeholder="******"
                          onChange={(e) => setOldPassword(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <label htmlFor="newPassword">New Password</label>
                        <Input
                          id="newPassword"
                          placeholder="******"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => {
                        // Use existing values if fields are empty
                        const updatedFirstName = firstName !== '' ? firstName : user.firstName;
                        const updatedLastName = lastName !== '' ? lastName : user.lastName;
                        const updatedEmail = email !== '' ? email : user.email;
                        const updatedRole = role !== '' ? role : user.role;

                        // Update user details
                        updateUser(
                          token,
                          user.id.toString(),
                          updatedFirstName,
                          updatedLastName,
                          updatedEmail,
                          updatedRole,
                        )
                          .then((data) => {
                            console.log(data);
                            // If password length is greater than 0, update the password
                            if (password.length > 0) {
                              updateUserPassword(token, user.id.toString(), oldPassword, password)
                                .then((data) => {
                                  console.log(data);
                                  // Reload the page after updating the password
                                  window.location.reload();
                                })
                                .catch((error) => {
                                  console.error('Error updating password:', error);
                                });
                            } else {
                              // Reload the page if there's no password to update
                              window.location.reload();
                            }
                          })
                          .catch((error) => {
                            console.error('Error updating user details:', error);
                          });
                      }}
                    >
                      Save changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TableCell>
            <TableCell>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="hover:bg-red-500">
                    Delete Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Obrišite profil</DialogTitle>
                    <DialogDescription>
                      Jeste li sigurni da želite obrisati profil?
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter>
                    <Button
                      variant={'destructive'}
                      onClick={() => {
                        deleteUser(token, user.id.toString()).then((data) => {
                          console.log(data);
                          window.location.reload();
                        });
                      }}
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Users;
