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

const Session = () => {
  const { user, isLoading, id, token, setQuestions, setIsLoading, sessionData } = useAuth();
  const [answers, setAnswers] = useState<votesProps>();
  const [comments, setComments] = useState<{ [key: number]: string }>({});
  const [showCommentFields, setShowCommentFields] = useState<{ [key: number]: boolean }>({});
  const [answeredQuestions, setAnsweredQuestions] = useState<{ [key: number]: boolean }>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (sessionData && sessionData.data && sessionData.data.sessions) {
      let allQuestions: Question[] = [];
      sessionData.data.sessions.forEach((session) => {
        if (session && session.questions) {
          allQuestions = [...allQuestions, ...session.questions];
        }
      });
      if (setQuestions) {
        // Check if setQuestions is defined
        setQuestions(allQuestions);
      }
    }
  }, [sessionData, setQuestions]);

  const handleAnswerChange = (questionId: number, choice: string) => {
    // Set answers state as before
    setAnswers({
      questionId,
      choice,
    });
    // Update the answeredQuestions state
    setAnsweredQuestions((prev) => ({
      ...prev,
      [questionId]: true,
    }));
    // Update the answeredQuestions state
    setAnsweredQuestions((prev) => ({
      ...prev,
      [questionId]: true,
    }));

    // Show comment field for the selected question
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

  // Modify the handleSend function
  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!answers) {
      return;
    }

    sendVotes(token, answers).then((data) => {
      if (data?.status === 201) {
        // Update the submittedQuestions state
        setSubmittedQuestions((prev) => ({
          ...prev,
          [answers.questionId]: true,
        }));
      }
    });
    if (comments[answers.questionId]) {
      sendComment(token, answers.questionId, comments[answers.questionId]);
      setComments((prevComments) => {
        const newComments = { ...prevComments };
        delete newComments[answers.questionId];
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

  // Show loading state if isLoading is true
  if (isLoading || sessionData === null) {
    return <Placeholder />;
  }

  // Show user data if isLoading is false
  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center ">
      <div className="space-y-4 mt-28 text-center">
        <h1 className="text-2xl md:text-4xl">Dobro dosli na sajt za glasanje</h1>
        {sessionData?.data.sessions.length === 0 ? (
          <h2 className="text-xl font-semibold">Nema sejednica</h2>
        ) : (
          <h2> Danas imamo {sessionData?.data.pageInfo.total} sjednicu/e</h2>
        )}
      </div>
      <div className="mt-4 flex flex-col items-center" >
        <div className="flex flex-wrap gap-4 items-start justify-center ">
          {sessionData?.data.sessions.map((session, id) => {
            return (
              <div key={session.id} className=" min-w-[300px] text-center p-6">
                <Link
                  href={`/home/${session.id}`}
                  className={`${buttonVariants({ variant: 'outline' })} !text-3xl !font-bold !p-10`}
                >
                  {session.title}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Session;
