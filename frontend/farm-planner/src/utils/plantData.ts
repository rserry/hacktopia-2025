export type PlantData = {
    name: string;
    category: string;
    latinName: string;
    climate: string;
    wateringNeeds: string;
    timeToConsumable: number;
    weight: number;
    calories: number;
    proteins: number;
    surface: number;
};

export const loadPlantData = async (): Promise<PlantData[]> => {
    const response = await fetch('/api/plants');
    if (!response.ok) {
        throw new Error('Failed to load plant data');
    }
    return response.json();
};