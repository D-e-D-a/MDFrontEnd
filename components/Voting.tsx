'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from './user-provider';
import { getSession } from '@/lib/apiCalls';
import Link from 'next/link';
import { buttonVariants } from './ui/button';
import Placeholder from './Placeholder';
import { SessionRootObjectProps } from '@/lib/types';

export default function Voting() {
  const { questions, token } = useAuth();
  const [results, setResults] = useState<SessionRootObjectProps>();
  const [sessionId, setSessionId] = useState<number[]>([]);

  useEffect(() => {
    getSession(token)
      .then((data) => {
        setResults(data?.data);
      })
      .catch((error) => {
        console.error('Error fetching session data:', error);
      });
  }, [questions, token]);

  if (!results) {
    return <Placeholder />;
  }
  console.log(results);

  return (
    <div className="flex flex-wrap items-center justify-around h-screen gap-6">
      {questions && questions.length > 0 ? (
        results?.data?.sessions?.map((result, index) => {
          return (
            <div key={index} className="h-[80%]">
              <h1 className="text-2xl font-bold mb-4">Sesija: {result.title}</h1>
              <div className="">
                <p className="mb-2 text-lg font-semibold">Pitanje je:</p>
                {result.questions.map((dataItem, dataIndex) => {
                  // Count the 'YES' and 'NO' votes
                  const yesVotes = dataItem.votes.filter((vote) => vote.choice === 'YES').length;
                  const noVotes = dataItem.votes.filter((vote) => vote.choice === 'NO').length;

                  return (
                    <div
                      key={dataIndex}
                      className="border border-primary p-4 flex flex-col gap-4 mt-4"
                    >
                      <h2>
                        {dataItem.id}.{dataItem.title}
                      </h2>
                      <p>Yes votes: {yesVotes}</p>
                      <p>No votes: {noVotes}</p>
                      <div>
                        <h3>Comments:</h3>
                        {dataItem.comments.length === 0 ? (
                          <p>No comments yet</p>
                        ) : (
                          <div className="border border-secondary p-4 h-28 overflow-auto">
                            {dataItem.comments.map((comment, commentIndex) => (
                              <p key={commentIndex}>{comment.text}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center flex items-center justify-center  h-screen">
          Molimo vas da prvo glasate na pitanja sa{' '}
          <Link href={'/home'} className={buttonVariants({ variant: 'link' })}>
            pocetne stranice
          </Link>
        </p>
      )}
    </div>
  );
}
