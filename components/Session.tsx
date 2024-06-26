'use client';
import { SessionRootObjectProps, questionsProps, votesProps } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import { useAuth } from './user-provider';
import { Button, buttonVariants } from './ui/button';
import { baseUrl, getSession, sendComment, sendVotes } from '@/lib/apiCalls';
import Placeholder from './Placeholder';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import Link from 'next/link';

const Session = () => {
  const { user, isLoading, id, token, setQuestions, setIsLoading, sessionData } = useAuth();
  const [answers, setAnswers] = useState<votesProps>();
  const [comments, setComments] = useState<{ [key: number]: string }>({});
  const [showCommentFields, setShowCommentFields] = useState<{ [key: number]: boolean }>({});
  const [answeredQuestions, setAnsweredQuestions] = useState<{ [key: number]: boolean }>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (sessionData && sessionData.data && sessionData.data.sessions) {
      let allQuestions: questionsProps[] = [];
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
      <div className="space-y-4 mt-28">
        <h1 className="text-2xl md:text-4xl">Dobro dosli {user?.data.data.user.firstName}</h1>
        {sessionData?.data.sessions.length === 0 ? (
          <h2 className="text-xl font-semibold">Nema sesija</h2>
        ) : (
          <h2> Danas imamo {sessionData?.data.pageInfo.total} sesiju/e o kojima se glasa:</h2>
        )}
      </div>
      <form className="mt-4 flex flex-col items-center" onSubmit={handleSend}>
        <div className="flex flex-wrap gap-4 items-start justify-center ">
          {sessionData?.data.sessions.map((session) => {
            return (
              <div key={session.id} className="border border-primary min-w-[300px] text-center p-6">
                <h2 className="text-xl font-semibold">{session.title}</h2>
                <div className="p-4 flex flex-col gap-8 items-center justify-center">
                  {session.questions.map((question, id) => {
                    return (
                      <div className="flex flex-col gap-6 items-baseline" key={question.id}>
                        <p>
                          <span className="font-bold text-primary mr-2">{id + 1}.</span>
                          {question.title}
                        </p>
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
                        </div>
                        <Textarea
                          placeholder="Unesite komentar"
                          value={comments[question.id] || ''}
                          onChange={(e) => handleCommentChange(question.id, e)}
                          disabled={!showCommentFields[question.id]}
                        />
                        {submittedQuestions[question.id] ? (
                          <Link href="/results" className={`${buttonVariants({})}  w-full`}>
                            Pogledaj rezultate
                          </Link>
                        ) : (
                          <Button
                            className=" w-full"
                            type="submit"
                            disabled={!answeredQuestions[question.id]}
                          >
                            Pošalji
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </form>
    </div>
  );
};

export default Session;
