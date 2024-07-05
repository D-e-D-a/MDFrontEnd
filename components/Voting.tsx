'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from './user-provider';
import { getSessionById } from '@/lib/apiCalls';
import Placeholder from './Placeholder';
import { Question, Session, votesProps } from '@/lib/types';
import { Chart } from 'react-google-charts';

interface VotingProps {
  id: string | number;
}
interface SingleSessionProps {
  status: string;
  data: Session;
}

export default function Voting({ id }: VotingProps) {
  const { token } = useAuth();
  const [results, setResults] = useState<SingleSessionProps>();

  useEffect(() => {
    getSessionById(token, id)
      .then((data) => {
        setResults(data?.data);
      })
      .catch((error) => {
        console.error('Error fetching session data:', error);
      });
  }, [id, token]);

  if (!results) {
    return <Placeholder />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  py-8">
      {results?.data?.questions.map((question: Question, index: number) => {
        // Count the 'YES' and 'NO' votes
        const yesVotes = question.votes.filter((vote: votesProps) => vote.choice === 'YES').length;
        const noVotes = question.votes.filter((vote: votesProps) => vote.choice === 'NO').length;
        const abstainVotes = question.votes.filter(
          (vote: votesProps) => vote.choice === 'ABSTAIN',
        ).length;

        // Prepare data for the chart
        const chartData = [
          ['Vote', 'Count'],
          ['Yes', yesVotes],
          ['No', noVotes],
          ['Abstain', abstainVotes],
        ];
        const chartOptions = {
          is3D: true,
          backgroundColor: 'transparent',
          colors: ['#008000','#FF0000','#0000FF' ],
          legend: {
            textStyle: {
              color: 'white',
              fontSize: 16,
            },
          },
        };

        return (
          <div key={index} className="bg-gray-900 rounded-lg shadow-md p-6 w-full max-w-4xl mb-8">
            <h1 className="text-3xl font-bold mb-4 text-center">{results.data.title}</h1>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">
                {index + 1}. {question.title}
              </h2>
              <Chart
                chartType="PieChart"
                data={chartData}
                options={chartOptions}
                width="100%"
                height="400px"
                legendToggle
              />
              <div className="mt-4">
                <p className="text-lg">
                  Yes votes: <span className="font-bold">{yesVotes}</span>
                </p>
                <p className="text-lg">
                  No votes: <span className="font-bold">{noVotes}</span>
                </p>
                <p className="text-lg">
                  Abstain votes: <span className="font-bold">{abstainVotes}</span>
                </p>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Comments:</h3>
                {question.comments.length === 0 ? (
                  <p className="text-gray-600">No comments yet</p>
                ) : (
                  <div className="border border-gray-300 p-4 h-28 overflow-auto rounded-md mt-2">
                    {question.comments.map((comment, commentIndex) => (
                      <p key={commentIndex} className="text-gray-400 mb-2">
                        {comment.text}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
