import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import type { PlantData } from '@/utils/plantData';

export async function GET() {
    try {
        const filePath = path.resolve(process.cwd(), 'public', 'data', 'dataset_edible_plants_extended_v2.csv');
        const text = await fs.readFile(filePath, 'utf-8');

        const rows = text.split('\n')
            .slice(1)
            .filter(row => row.trim());

        const plants: PlantData[] = rows.map(row => {
            const [
                name, category, latinName, climate, wateringNeeds,
                timeToConsumable, weight, calories, proteins, surface
            ] = row.split(',');

            return {
                name,
                category,
                latinName,
                climate,
                wateringNeeds,
                timeToConsumable: Number(timeToConsumable),
                weight: Number(weight),
                calories: Number(calories),
                proteins: Number(proteins),
                surface: Number(surface)
            };
        });

        return NextResponse.json(plants);
    } catch (error) {
        console.error('Error loading plant data:', error);
        return NextResponse.json({ error: 'Failed to load plant data' }, { status: 500 });
    }
}