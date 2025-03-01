'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import ResultDisplay from '@/components/ResultDisplay';

const ResultPage: React.FC = () => {
  const searchParams = useSearchParams()

  const result = searchParams.get('result')

  if (!result) {
    return <div>Loading...</div>;
  }

  const parsedResult = JSON.parse(result as string);
  console.log(parsedResult);

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Calculation Result</h1>
        <ResultDisplay location={parsedResult.location} crops={parsedResult.crops} />
      </main>
    </div>
  );
};

export default ResultPage;