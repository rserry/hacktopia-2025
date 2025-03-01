import React from 'react';
import { TreePalm, Sun, CloudRain, Snowflake } from 'lucide-react';

interface Location {
    name: string;
    climate: string;
}

interface Crop {
    name: string;
    area: number;
    cost: number;
    climate: string;
}

interface ResultProps {
    location: string;
    crops: Crop[] | null;
}

const locationClimate: Location[] = [
    { name: "Airstrip One", climate: "B" },
    { name: "Victory Mansions", climate: "A" },
    { name: "Ministry of Truth", climate: "A" },
    { name: "Ministry of Love", climate: "C" },
    { name: "Ministry of Peace", climate: "C" },
    { name: "Ministry of Plenty", climate: "C" },
    { name: "Chestnut Tree Café", climate: "C" },
    { name: "Golden Country", climate: "D" },
    { name: "Outer Party Sector", climate: "D" },
    { name: "Prole District", climate: "E" }
];

const getClimateIcon = (climate: string) => {
    switch (climate) {
        case "Tropical":
            return <TreePalm style={{ width: '36px', height: '36px', color: 'green' }} className="inline-block ml-2" />;
        case "Temperate":
            return <Sun style={{ width: '36px', height: '36px', color: 'yellow' }} className="inline-block ml-2" />;
        case "Mediterranean":
            return <CloudRain style={{ width: '36px', height: '36px', color: 'blue' }} className="inline-block ml-2" />;
        case "Polar":
            return <Snowflake style={{ width: '36px', height: '36px', color: 'white' }} className="inline-block ml-2" />;
        default:
            return null;
    }
};

const ResultDisplay: React.FC<ResultProps> = ({ location, crops }) => {
    const locationInfo = locationClimate.find(loc => loc.name === location);
    const climate = locationInfo ? locationInfo.climate : "Unknown";

    return (
        <div className="result-display">
            <h2 className="text-xl font-bold mb-4">
                Recommended Location: {location}
                {getClimateIcon(climate)}
            </h2>
            <h3 className="text-lg font-semibold mb-2">Crops and Area Allocation:</h3>
            {crops ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 border-b border-gray-200 text-center">Crop</th>
                                <th className="py-2 px-4 border-b border-gray-200 text-center">Climate</th>
                                <th className="py-2 px-4 border-b border-gray-200 text-center">Area (m²)</th>
                                <th className="py-2 px-4 border-b border-gray-200 text-center">Cost ($/m²)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {crops.map((crop) => (
                                <tr key={crop.name} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b border-gray-200 text-center">{crop.name}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 text-center">{getClimateIcon(crop.climate)}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 text-center">{crop.area}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 text-center">{crop.cost}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No crops data available.</p>
            )}
        </div>
    );
};

export default ResultDisplay;