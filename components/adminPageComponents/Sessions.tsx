'use client';
import { Input } from '../ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createSession, deleteSession, getSession, updateSession } from '@/lib/apiCalls';
import { useAuth } from '../user-provider';
import { useEffect, useState } from 'react';
import { Session } from '@/lib/types';
import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  Table,
} from '../ui/table';
import { Pen, Plus, Trash, Trash2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

const Sessions = () => {
  const { token } = useAuth();
  const [sessionName, setSessionName] = useState('');
  const [sessions, setSessions] = useState<{ data: { sessions: Session[] } } | null>(null);

  useEffect(() => {
    getSession(token).then((data) => {
      setSessions(data?.data);
    });
  }, [token]);

  const handleSubmit = async (token: string, sessionName: string) => {
    createSession(token, sessionName).then((data) => {
      console.log(data);
      window.location.reload();
    });
  };

  const handleUpdate = async (token: string, sessionId: string, sessionName: string) => {
    updateSession(token, sessionId, sessionName).then((data) => {
      console.log('🚀 ~ updateSession ~ data:', data);
      window.location.reload();
    });
  };
  return (
    <div className="flex flex-col items-center w-full ">
      <h1 className="text-3xl font-bold mb-10">Sesije</h1>
      <Table className="mb-8 w-[90%] mx-auto border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-lg font-semibold text-slate-500">Session Title</TableHead>
            <TableHead className="text-lg font-semibold text-slate-500">Edit</TableHead>
            <TableHead className="text-lg font-semibold text-slate-500">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions?.data?.sessions.map((session, index) => (
            <TableRow key={index}>
              <TableCell>{session.title}</TableCell>

              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant={'outline'} className="hover:bg-blue-500">
                      <Pen className="w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit session</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to edit this session?
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col space-y-1.5">
                      <label htmlFor="title">Pitanje</label>
                      <Input
                        id="title"
                        placeholder="Naziv sesije"
                        onChange={(e) => setSessionName(e.target.value)}
                      />
                    </div>

                    <DialogFooter>
                      <Button
                        onClick={() => handleUpdate(token, session.id.toString(), sessionName)}
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>

              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant={'outline'} className="hover:bg-red-500">
                      <Trash2 className="w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Delete question</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this question?
                      </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                      <Button variant={'destructive'}  onClick={() => deleteSession(token, session.id.toString()).then(() => window.location.reload())}>
                        Delete <Trash2 className="w-4" />
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}

          <TableRow>
            <TableCell colSpan={3} className="text-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="hover:bg-green-500 mx-auto">
                    <Plus className="w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add new session</DialogTitle>
                    <DialogDescription>Enter the name for the new session.</DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="title">Sesija</label>
                    <Input
                      id="title"
                      placeholder="Naziv sesije"
                      onChange={(e) => setSessionName(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <Button onClick={() => handleSubmit(token, sessionName)}>Add Session</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      {/* <div className="w-full flex flex-wrap items-center justify-around gap-10 mt-[300px] md:mt-0">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Kreiraj Sesiju</CardTitle>
            <CardDescription>Kreiraj sesiju projekta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="sessionName">Naziv</label>
                  <Input
                    id="sessionName"
                    placeholder="Naziv sesije projekta"
                    onChange={(e) => setSessionName(e.target.value)}
                  />
                </div>
              </div>
              <CardFooter className="flex justify-center  items-end p-0 pt-6">
                <Button type="submit">Kreiraj</Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="mb-4">Updejtuj Sesiju</CardTitle>
            <Select value={selectedSession} onValueChange={setSelectedSession}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Odaberi sesiju" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sesije</SelectLabel>
                  {sessions?.data?.sessions?.map((session: Session) => (
                    <SelectItem key={session.id} value={session.id.toString()}>
                      <h1>{session.title}</h1>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="updateSessionName">Naziv</label>
                  <Input
                    id="updateSessionName"
                    placeholder="Promijenite naziv sesije projekta"
                    onChange={(e) => setUpdatedSessionName(e.target.value)}
                  />
                </div>
              </div>
              <CardFooter className="flex justify-center  items-end p-0 pt-6">
                <Button type="submit" variant={'outline'}>
                  Updejtuj
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="mb-4">Obrisi Sesiju</CardTitle>
            <Select value={selectedSession} onValueChange={setSessionId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Odaberi sesiju" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sesije</SelectLabel>
                  {sessions?.data?.sessions?.map((session: Session) => (
                    <SelectItem key={session.id} value={session.id.toString()}>
                      <h1>{session.title}</h1>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardHeader>

          <CardFooter className="flex justify-center items-end ">
            <Button
              type="submit"
              variant={'destructive'}
              onClick={() => deleteSession(token, sessionId)}
            >
              Obriši
            </Button>
          </CardFooter>
        </Card>
      </div> */}
    </div>
  );
};

export default Sessions;
