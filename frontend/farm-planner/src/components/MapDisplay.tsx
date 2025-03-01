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
    { id: 1, name: "Airstrip One", coordinates: { x: 400, y: 70 } },
    { id: 2, name: "Victory Mansions", coordinates: { x: 520, y: 390 } },
    { id: 3, name: "Ministry of Truth", coordinates: { x: 440, y: 420 } },
    { id: 4, name: "Ministry of Love", coordinates: { x: 380, y: 260 } },
    { id: 5, name: "Ministry of Peace", coordinates: { x: 240, y: 380 } },
    { id: 6, name: "Ministry of Plenty", coordinates: { x: 600, y: 200 } },
    { id: 7, name: "Chestnut Tree Café", coordinates: { x: 320, y: 190 } },
    { id: 8, name: "Golden Country", coordinates: { x: 270, y: 470 } },
    { id: 9, name: "Outer Party Sector", coordinates: { x: 620, y: 80 } },
    { id: 10, name: "Prole District", coordinates: { x: 160, y: 340 } }
];

interface MapDisplayProps {
    selectedLocation?: string;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ selectedLocation }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState({ x: 1, y: 1 });

    // Original image dimensions
    const ORIGINAL_WIDTH = 800;
    const ORIGINAL_HEIGHT = 600;

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