import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

export interface Location {
    id: number;
    name: string;
    coordinates: {
        x: number;
        y: number;
    };
}

const locationData: Location[] = [
    { id: 1, name: "Airstrip One", coordinates: { x: 896, y: 119 } },
    { id: 2, name: "Victory Mansions", coordinates: { x: 1165, y: 666 } },
    { id: 3, name: "Ministry of Truth", coordinates: { x: 986, y: 717 } },
    { id: 4, name: "Ministry of Love", coordinates: { x: 851, y: 444 } },
    { id: 5, name: "Ministry of Peace", coordinates: { x: 538, y: 649 } },
    { id: 6, name: "Ministry of Plenty", coordinates: { x: 1344, y: 341 } },
    { id: 7, name: "Chestnut Tree Café", coordinates: { x: 717, y: 324 } },
    { id: 8, name: "Golden Country", coordinates: { x: 605, y: 802 } },
    { id: 9, name: "Outer Party Sector", coordinates: { x: 1389, y: 137 } },
    { id: 10, name: "Prole District", coordinates: { x: 358, y: 580 } }
];

type LocationNames = "Airstrip One" | "Victory Mansions" | "Ministry of Truth" |
    "Ministry of Love" | "Ministry of Peace" | "Ministry of Plenty" |
    "Chestnut Tree Café" | "Golden Country" | "Outer Party Sector" | "Prole District";

interface MapDisplayProps {
    selectedLocation?: LocationNames;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ selectedLocation }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState({ x: 1, y: 1 });

    // Original image dimensions
    const ORIGINAL_WIDTH = 1792;
    const ORIGINAL_HEIGHT = 1024;

    useEffect(() => {
        const updateScale = () => {
            if (mapRef.current) {
                const currentWidth = mapRef.current.offsetWidth;
                const currentHeight = mapRef.current.offsetHeight;

                setScale({
                    x: currentWidth / ORIGINAL_WIDTH,
                    y: currentHeight / ORIGINAL_HEIGHT
                });
            }
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, []);

    const selectedLocationData = locationData.find(loc =>
        loc.name.toLowerCase() === selectedLocation?.toLowerCase()
    );

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div ref={mapRef} className="relative w-full">
                <Image
                    src="/map.webp"
                    alt="Fantasy World Map"
                    width={ORIGINAL_WIDTH}
                    height={ORIGINAL_HEIGHT}
                    className="w-full h-auto object-contain"
                />
                {selectedLocationData && (
                    <div
                        className="absolute z-10"
                        style={{
                            left: `${selectedLocationData.coordinates.x * scale.x}px`,
                            top: `${selectedLocationData.coordinates.y * scale.y}px`,
                            transform: 'translate(-50%, -100%)'
                        }}
                    >
                        <div className="w-5 h-5 bg-red-500 rounded-full border-2 border-white shadow-md" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapDisplay;