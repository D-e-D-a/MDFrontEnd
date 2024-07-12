'use client';
import { Input } from '../ui/input';
import { useEffect, useState } from 'react';

import { Button } from '../ui/button';

import { deleteQuestion, getSession, sendQuestion, updateQuestion } from '@/lib/apiCalls';
import { useAuth } from '../user-provider';
import { SessionRootObjectProps } from '@/lib/types';
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
import React from 'react';
import { DialogClose } from '@radix-ui/react-dialog';

export default function Questions() {
  const [questionTitle, setQuestionTitle] = useState('');
  const [agendaTitle, setAgendaTitle] = useState('');
  const [file, setFile] = useState<File[]>([]);
  const [sessionData, setSessionData] = useState<SessionRootObjectProps | null>(null);
  // const [sessionId, setSessionId] = useState<string>('');
  const { token } = useAuth();

  useEffect(() => {
    getSession(token).then((data) => {
      setSessionData(data?.data);
    });
  }, [token]);

  const handleSubmitQuestion = async (token: string, questionTitle: string, sessionId: string) => {
    sendQuestion(token, agendaTitle, questionTitle, sessionId, file[0]).then((data) => {
      if (data) {
        window.location.reload();
      }
    });
  };

  const handleUpdateQuestion = async (token: string, questionId: string, questionTitle: string) => {
    updateQuestion(token, questionId, agendaTitle, questionTitle).then((data) => {
      if (data) {
        window.location.reload();
      }
    });
  };
  const handleDeleteQuestion = async (token: string, id: string) => {
    deleteQuestion(token, id).then((data) => {
      console.log('🚀 ~ deleteQuestion ~ data:', data);
      window.location.reload();
    });
  };
  if (sessionData?.data?.sessions.length === 0) {
    return (
      <div className="text-3xl h-screen flex items-center justify-center">
        No sessions, please create a session
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center w-full  mt-20">
      {sessionData?.data?.sessions.map((session, index) => (
        <React.Fragment key={session.id}>
          <h1 className="text-3xl font-bold mb-10 text-primary">{session.title}</h1>
          <Table className="mb-8 w-[90%] mx-auto border">
            <TableHeader>
              <TableRow>
                <TableHead className="text-lg font-semibold text-slate-500">Agenda Title</TableHead>
                <TableHead className="text-lg font-semibold text-slate-500">
                  Question Title
                </TableHead>
                <TableHead className="text-lg font-semibold text-slate-500">Edit</TableHead>
                <TableHead className="text-lg font-semibold text-slate-500">Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {session.questions.map((question, index) => (
                <TableRow key={index}>
                  <TableCell>{question.title}</TableCell>
                  <TableCell>{question.content}</TableCell>
                  {/* Edit question */}
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant={'outline'} className="hover:bg-blue-500">
                          <Pen className="w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit question</DialogTitle>
                          <DialogDescription>
                            Jeste li sigurni da želite da izmijenite pitanje?
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col space-y-1.5">
                          <label htmlFor="agenda">Dnevni red</label>
                          <Input
                            id="agenda"
                            placeholder="Naziv dnevnog reda"
                            // value={question.title}
                            onChange={(e) => setAgendaTitle(e.target.value)}
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <label htmlFor="title">Pitanje</label>
                          <Input
                            id="title"
                            placeholder="Naziv pitanja"
                            // value={question.title}
                            onChange={(e) => setQuestionTitle(e.target.value)}
                          />
                        </div>

                        <DialogFooter>
                          <DialogClose>
                            <Button
                              onClick={() =>
                                handleUpdateQuestion(token, question.id.toString(), questionTitle)
                              }
                            >
                              Save
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  {/* Delete question */}
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
                            Jeste li sigurni da želite da obrišete pitanje?
                          </DialogDescription>
                        </DialogHeader>

                        <DialogFooter>
                          <Button
                            variant={'destructive'}
                            onClick={() => handleDeleteQuestion(token, question.id.toString())}
                          >
                            Delete <Trash2 className="w-4" />
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
              {/* Add question */}
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="hover:bg-green-500 mx-auto">
                        <Plus className="w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Dodaj pitanje</DialogTitle>
                        <DialogDescription>
                         Unesite detalje pitanja.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col space-y-1.5">
                        <label htmlFor="agenda">Dnevni red</label>
                        <Input
                          id="agenda"
                          placeholder="Naziv dnevnog reda"
                          onChange={(e) => setAgendaTitle(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <label htmlFor="title">Pitanje</label>
                        <Input
                          id="title"
                          placeholder="Naziv pitanja"
                          onChange={(e) => setQuestionTitle(e.target.value)}
                        />
                      </div>
                      <p className="text-sm text-slate-500">
                        Ukoliko imate da prilozite fajl za sjedndicu
                      </p>
                      <div className="flex flex-col space-y-1.5 relative">
                        <Input
                          type="file"
                          className="cursor-pointer block w-full text-sm text-slate-500 border-0 file:rounded-md file:text-base file:font-semibold file:bg-primary file:text-slate-100 hover:file:bg-primary/90"
                          onChange={(e) => {
                            if (e.target.files) {
                              setFile(Array.from(e.target.files));
                            }
                          }}
                        />

                        {file.length > 0 && (
                          <X
                            className="h-4 w-4 absolute right-1 top-2 cursor-no-drop"
                            onClick={() => setFile([])}
                          />
                        )}
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={() =>
                            handleSubmitQuestion(token, questionTitle, session.id.toString())
                          }
                        >
                          Add Question
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </React.Fragment>
      ))}
    </div>
  );
}
