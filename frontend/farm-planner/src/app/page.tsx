'use client';

import { useState, useEffect } from "react";
import Select from 'react-select';
import { loadPlantData, type PlantData } from '@/utils/plantData';
import LoadingPage from "@/components/LoadingPage";

type Option = {
  value: string;
  label: string;
  data?: PlantData;
};

interface FormData {
  preferred_categories: string[];
  preferred_crops: string[];
  disliked_crops: string[];
  budget: string;
  target_calories: string;
  target_protein: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [plantData, setPlantData] = useState<PlantData[]>([]);
  const [formData, setFormData] = useState<FormData>({
    preferred_categories: [],
    preferred_crops: [],
    disliked_crops: [],
    budget: '',
    target_calories: '',
    target_protein: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await loadPlantData();
        setPlantData(data);
      } catch (error) {
        console.error('Error loading plant data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const categoryOptions: Option[] = Array.from(
    new Set(plantData.map(plant => plant.category))
  ).map(category => ({
    value: category,
    label: category
  }));

  const plantOptions: Option[] = plantData.map(plant => ({
    value: plant.name,
    label: `${plant.name} (${plant.calories} kcal, ${plant.proteins}g protein)`,
    data: plant
  }));

  const handleSelectChange = (selectedOptions: readonly Option[] | null, actionMeta: { name?: string }) => {
    if (!actionMeta.name) return;

    setFormData(prev => ({
      ...prev,
      [actionMeta.name as string]: selectedOptions ? selectedOptions.map(opt => opt.value) : []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiResponse(null);
    setApiError('');

    try {
      const numericFormData = {
        ...formData,
        budget: formData.budget ? Number(formData.budget) : null,
        target_calories: formData.target_calories ? Number(formData.target_calories) : null,
        target_protein: formData.target_protein ? Number(formData.target_protein) : null
      };

      const response = await fetch('http://localhost:8000/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(numericFormData),
      });

      if (response.ok) {
        const data = await response.json();
        setApiResponse(data);
      } else {
        throw new Error('Failed to submit preferences');
      }
    } catch (error) {
      console.error('Error:', error);
      setApiError('Failed to submit preferences');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <LoadingPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Plant Preferences</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="category" className="block mb-2 font-medium">Plant Categories</label>
            <Select
              instanceId="category-select"
              id="category"
              name="category"
              value={categoryOptions.filter(opt => formData.preferred_categories.includes(opt.value))}
              onChange={(opt) => handleSelectChange(opt as readonly Option[], { name: 'preferred_categories' })}
              options={categoryOptions}
              className="react-select"
              placeholder="Search or select categories"
              isClearable
              isSearchable
              isMulti
              closeMenuOnSelect={false}
            />
          </div>

          <div>
            <label htmlFor="likedPlants" className="block mb-2 font-medium">Preferred Plants</label>
            <Select
              instanceId="liked-plants-select"
              id="likedPlants"
              name="likedPlants"
              value={plantOptions.filter(opt => formData.preferred_crops.includes(opt.value))}
              onChange={(opt) => handleSelectChange(opt as readonly Option[], { name: 'preferred_crops' })}
              options={plantOptions}
              className="react-select"
              placeholder="Search or select preferred plants"
              isClearable
              isSearchable
              isMulti
              closeMenuOnSelect={false}
            />
          </div>

          <div>
            <label htmlFor="dislikedPlants" className="block mb-2 font-medium">Disliked Plants</label>
            <Select
              instanceId="disliked-plants-select"
              id="dislikedPlants"
              name="dislikedPlants"
              value={plantOptions.filter(opt => formData.disliked_crops.includes(opt.value))}
              onChange={(opt) => handleSelectChange(opt as readonly Option[], { name: 'disliked_crops' })}
              options={plantOptions}
              className="react-select"
              placeholder="Search or select disliked plants"
              isClearable
              isSearchable
              isMulti
              closeMenuOnSelect={false}
            />
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="budget" className="block mb-2 font-medium">Budget ($)</label>
              <input
                type="number"
                id="budget"
                name="budget"
                min="0"
                value={formData.budget}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                placeholder="1000"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="targetCalories" className="block mb-2 font-medium">Target Daily Calories</label>
              <div className="relative">
                <input
                  type="number"
                  id="targetCalories"
                  name="target_calories"
                  min="0"
                  value={formData.target_calories}
                  onChange={handleChange}
                  className="w-full p-2 border rounded pl-3 pr-12"
                  placeholder="2000"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">kcal</span>
              </div>
            </div>

            <div>
              <label htmlFor="targetProtein" className="block mb-2 font-medium">Target Daily Protein</label>
              <div className="relative">
                <input
                  type="number"
                  id="targetProtein"
                  name="target_protein"
                  min="0"
                  value={formData.target_protein}
                  onChange={handleChange}
                  className="w-full p-2 border rounded pl-3 pr-12"
                  placeholder="50"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">g</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded transition-colors ${isSubmitting
              ? 'bg-green-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
              } text-white`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Preferences'}
          </button>

          {(apiResponse || apiError) && (
            <div className="mt-4 p-4 rounded border">
              {apiError ? (
                <p className="text-red-600">{apiError}</p>
              ) : (
                <pre className="whitespace-pre-wrap text-sm">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              )}
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
