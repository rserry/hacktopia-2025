'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ResultDisplay from '@/components/ResultDisplay';
import MapDisplay from '@/components/MapDisplay';
import LoadingPage from '@/components/LoadingPage';

const ResultPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const result = searchParams.get('result');

  useEffect(() => {
    if (!result) {
      router.replace('/');
    }
  }, [result, router]);

  if (!result) {
    return <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center">
      <LoadingPage />
    </div>;
  }

  const parsedResult = JSON.parse(result as string);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-900 mb-2">Your Farm Planning Results</h1>
          <p className="text-green-700">Here&apos;s what we recommend for your location</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-xl p-6">
            <ResultDisplay
              location={parsedResult.location}
              crops={parsedResult.crops}
            />
          </div>

          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-800">Location Map</h2>
            <MapDisplay
              selectedLocation={"Airstrip One"}
            />
          </div>
        </main>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            ← Back to Home
          </Link>
        </div>

        <footer className="mt-12 text-center text-sm text-green-600">
          <p>These recommendations are based on crop preference and climate data</p>
        </footer>
      </div>
    </div>
  );
};

export default ResultPage;