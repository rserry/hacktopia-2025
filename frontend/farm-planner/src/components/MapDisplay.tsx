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
    const [isExpanded, setIsExpanded] = useState(false);

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
    }, [isExpanded]); // Re-calculate scale when expanded state changes

    const selectedLocationData = locationData.find(loc =>
        loc.name.toLowerCase() === selectedLocation?.toLowerCase()
    );

    const LocationMarker = () => selectedLocationData && (
        <div
            className="absolute z-10"
            style={{
                left: `${selectedLocationData.coordinates.x * scale.x}px`,
                top: `${selectedLocationData.coordinates.y * scale.y}px`,
                transform: 'translate(-50%, -100%)'
            }}
        >
            <div className={`${isExpanded ? 'w-6 h-6' : 'w-5 h-5'} bg-red-500 rounded-full border-2 border-white ${isExpanded ? 'shadow-lg' : 'shadow-md'}`} />
        </div>
    );

    const MapContent = () => (
        <div
            ref={mapRef}
            className={`relative w-full ${isExpanded ? 'h-full' : ''}`}
            style={{ aspectRatio: `${ORIGINAL_WIDTH} / ${ORIGINAL_HEIGHT}` }}
        >
            <Image
                src="/map.webp"
                alt="Fantasy World Map"
                width={ORIGINAL_WIDTH}
                height={ORIGINAL_HEIGHT}
                className="w-full h-full object-contain"
                priority={true}
            />
            <LocationMarker />
        </div>
    );

    if (isExpanded) {
        return (
            <div
                className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                onClick={() => setIsExpanded(false)}
            >
                <div
                    className="bg-white rounded-lg w-[95vw] h-[90vh] p-6 relative flex items-center justify-center"
                    onClick={e => e.stopPropagation()}
                >
                    <button
                        onClick={() => setIsExpanded(false)}
                        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-colors cursor-pointer hover:shadow-lg"
                    >
                        <svg className="w-6 h-6 text-gray-600 hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="h-full w-full flex items-center justify-center">
                        <MapContent />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative w-full max-w-4xl mx-auto cursor-pointer"
            onClick={() => setIsExpanded(true)}
        >
            <MapContent />
        </div>
    );
};

export default MapDisplay;