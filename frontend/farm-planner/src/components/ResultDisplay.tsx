import React from 'react';

interface ResultProps {
  location: string;
  crops: { [key: string]: number } | null;
}

const ResultDisplay: React.FC<ResultProps> = ({ location, crops }) => {
  return (
    <div className="result-display">
      <h2 className="text-xl font-bold mb-4">Recommended Location: {location}</h2>
      <h3 className="text-lg font-semibold mb-2">Crops and Area Allocation:</h3>
      {crops ? (
        <ul className="list-disc pl-5">
        {Object.entries(crops).map(([crop, area]) => (
          <li key={crop} className="mb-1">
            {crop}: {area} squared metres
          </li>
        ))}
      </ul>
      ) : (
        <p>No crops data available.</p>
      )}
    </div>
  );
};

export default ResultDisplay;