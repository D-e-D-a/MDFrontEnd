'use client';
import { SessionRootObjectProps, Question, votesProps } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import { useAuth } from './user-provider';
import { Button, buttonVariants } from './ui/button';
import { baseUrl, getSession, sendComment, sendVotes } from '@/lib/apiCalls';
import Placeholder from './Placeholder';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { DialogClose } from '@radix-ui/react-dialog';

const DailyVoting = ({ id }: { id: string | number }) => {
  const { user, isLoading, token, setQuestions, setIsLoading, sessionData } = useAuth();
  const [answers, setAnswers] = useState<votesProps>();
  const [comments, setComments] = useState<{ [key: number]: string }>({});
  const [showCommentFields, setShowCommentFields] = useState<{ [key: number]: boolean }>({});
  const [answeredQuestions, setAnsweredQuestions] = useState<{ [key: number]: boolean }>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<{ [key: number]: boolean }>({});
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState<boolean | undefined>(false);

  useEffect(() => {
    if (sessionData && sessionData.data && sessionData.data.sessions) {
      let allQuestions: Question[] = [];
      sessionData.data.sessions.forEach((session) => {
        if (session && session.questions) {
          allQuestions = [...allQuestions, ...session.questions];
        }
      });
      if (setQuestions) {
        setQuestions(allQuestions);
      }
    }
  }, [sessionData, setQuestions]);

  useEffect(() => {
    const allAnswered = sessionData?.data.sessions
      .filter((session) => session.id == id)
      .every((session) => session.questions.every((question) => submittedQuestions[question.id]));
    setAllQuestionsAnswered(allAnswered);
  }, [submittedQuestions, sessionData, id]);

  const handleAnswerChange = (questionId: number, choice: string) => {
    setAnswers({
      questionId,
      choice,
    });
    setAnsweredQuestions((prev) => ({
      ...prev,
      [questionId]: true,
    }));
    setShowCommentFields((prevState) => ({
      ...prevState,
      [questionId]: true,
    }));
  };

  const handleCommentChange = (questionId: number, e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComments((prevComments) => ({
      ...prevComments,
      [questionId]: e.target.value,
    }));
  };

  const handleSend = async (questionId: number) => {
    if (!answers) {
      return;
    }

    sendVotes(token, answers).then((data) => {
      if (data?.status === 201) {
        setSubmittedQuestions((prev) => ({
          ...prev,
          [questionId]: true,
        }));
      }
    });

    if (comments[questionId]) {
      sendComment(token, questionId, comments[questionId]);
      setComments((prevComments) => {
        const newComments = { ...prevComments };
        delete newComments[questionId];
        return newComments;
      });
    }
  };

  useEffect(() => {
    if (sessionData === null) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [sessionData]);

  if (isLoading || sessionData === null) {
    return <Placeholder />;
  }

  return (
    <div>
      {sessionData?.data.sessions
        .filter((session) => session.id == id)
        .map((session) => {
          return (
            <div key={session.id} className=" min-w-[300px] text-center p-6">
              <div className="p-4 flex flex-col gap-8 items-baseline justify-center ">
                {session.questions.map((question, id) => {
                  return (
                    <div className="flex gap-3 items-center " key={question.id}>
                      <ul className="list-disc font-bold text-primary mr-2 pl-5">
                        <li>{question.title}</li>
                      </ul>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant={'outline'}
                            className="hover:bg-blue-500"
                            disabled={answeredQuestions[question.id]}
                          >
                            Glasaj
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>{question.title}</DialogTitle>
                            <DialogDescription>{question?.content}</DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-col gap-6 items-baseline">
                            {question.documents.map((document) => {
                              const fileUrl = `${baseUrl}/media/download/${document.id}`;
                              return (
                                <div key={document.id}>
                                  <a href={fileUrl} download>
                                    {document.fileName}
                                  </a>
                                </div>
                              );
                            })}
                            <div className="flex gap-2 items-center ">
                              <Input
                                type="radio"
                                id={`yes-${question.id}`}
                                name={question.id.toString()}
                                onChange={(e) => handleAnswerChange(question.id, 'YES')}
                              />
                              <Label htmlFor={`yes-${question.id}`} className="cursor-pointer">
                                Yes
                              </Label>
                              <Input
                                type="radio"
                                id={`no-${question.id}`}
                                name={question.id.toString()}
                                onChange={(e) => handleAnswerChange(question.id, 'NO')}
                              />
                              <Label htmlFor={`no-${question.id}`} className="cursor-pointer">
                                No
                              </Label>
                              <Input
                                type="radio"
                                id={`abstain-${question.id}`}
                                name={question.id.toString()}
                                onChange={(e) => handleAnswerChange(question.id, 'ABSTAIN')}
                              />
                              <Label htmlFor={`abstain-${question.id}`} className="cursor-pointer">
                                Abstain
                              </Label>
                            </div>
                            <Textarea
                              placeholder="Unesite komentar"
                              value={comments[question.id] || ''}
                              onChange={(e) => handleCommentChange(question.id, e)}
                              disabled={!showCommentFields[question.id]}
                            />
                          </div>

                          <DialogFooter>
                            <DialogClose className="w-full">
                              <Button
                                className=" w-full"
                                type="button"
                                onClick={() => handleSend(question.id)}
                                disabled={!answeredQuestions[question.id]}
                              >
                                Pošalji
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  );
                })}
              </div>
              {allQuestionsAnswered && (
                <div className="mt-6">
                  <Link
                    href={`/results/${session.id}`}
                    className={buttonVariants({ variant: 'outline' })}
                  >
                    Go to Results
                  </Link>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default DailyVoting;
