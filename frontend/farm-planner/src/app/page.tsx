'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
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

import { StylesConfig, ControlProps, CSSObjectWithLabel } from 'react-select';

const selectStyles: StylesConfig<Option, true> = {
  control: (base: CSSObjectWithLabel, props: ControlProps<Option, true>) => ({
    ...base,
    borderColor: props.isFocused ? '#22c55e' : '#e5e7eb', // green-500 when focused, gray-200 when not
    boxShadow: props.isFocused ? '0 0 0 2px rgb(34 197 94 / 0.2)' : 'none',
    '&:hover': {
      borderColor: props.isFocused ? '#22c55e' : '#e5e7eb'
    }
  })
};

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
  const [apiError, setApiError] = useState<string>('');
  const router = useRouter();

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

  const availableLikedPlantOptions = plantOptions.filter(
    opt => !formData.disliked_crops.includes(opt.value)
  );

  const availableDislikedPlantOptions = plantOptions.filter(
    opt => !formData.preferred_crops.includes(opt.value)
  );

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
    setApiError('');

    try {
      const numericFormData = {
        ...formData,
        budget: formData.budget ? Number(formData.budget) : null,
        target_calories: formData.target_calories ? Number(formData.target_calories) : null,
        target_protein: formData.target_protein ? Number(formData.target_protein) : null
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(numericFormData),
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/result?result=${encodeURIComponent(JSON.stringify(result))}`);
      } else if (response.status === 400) {
        router.push(`/result?error=true`);
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
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
        <LoadingPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-900 mb-2">Farm Planning Preferences</h1>
          <p className="text-green-700">Tell us about your farming preferences and goals</p>
        </header>

        <main className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="category" className="block mb-2 font-medium text-green-800">Preferred Plant Categories</label>
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
                  styles={selectStyles}
                />
              </div>

              <div>
                <label htmlFor="likedPlants" className="block mb-2 font-medium text-green-800">Preferred Plants</label>
                <Select
                  instanceId="liked-plants-select"
                  id="likedPlants"
                  name="likedPlants"
                  value={plantOptions.filter(opt => formData.preferred_crops.includes(opt.value))}
                  onChange={(opt) => handleSelectChange(opt as readonly Option[], { name: 'preferred_crops' })}
                  options={availableLikedPlantOptions}
                  className="react-select"
                  placeholder="Search or select preferred plants"
                  isClearable
                  isSearchable
                  isMulti
                  closeMenuOnSelect={false}
                  styles={selectStyles}
                />
              </div>

              <div>
                <label htmlFor="dislikedPlants" className="block mb-2 font-medium text-green-800">Disliked Plants</label>
                <Select
                  instanceId="disliked-plants-select"
                  id="dislikedPlants"
                  name="dislikedPlants"
                  value={plantOptions.filter(opt => formData.disliked_crops.includes(opt.value))}
                  onChange={(opt) => handleSelectChange(opt as readonly Option[], { name: 'disliked_crops' })}
                  options={availableDislikedPlantOptions}
                  className="react-select"
                  placeholder="Search or select disliked plants"
                  isClearable
                  isSearchable
                  isMulti
                  closeMenuOnSelect={false}
                  styles={selectStyles}
                />
              </div>

              <div className="space-y-4">

                <div>
                  <label htmlFor="budget" className="block mb-2 font-medium text-green-800">Budget</label>
                  <div className="relative">
                    <input
                      type="number"
                      id="budget"
                      name="budget"
                      min="0"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-200 rounded pl-3 pr-12 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                      placeholder="100000"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="targetCalories" className="block mb-2 font-medium text-green-800">Target Daily Calories</label>
                  <div className="relative">
                    <input
                      type="number"
                      id="targetCalories"
                      name="target_calories"
                      min="0"
                      value={formData.target_calories}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-200 rounded pl-3 pr-12 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                      placeholder="2000"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">kcal</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="targetProtein" className="block mb-2 font-medium text-green-800">Target Daily Protein</label>
                  <div className="relative">
                    <input
                      type="number"
                      id="targetProtein"
                      name="target_protein"
                      min="0"
                      value={formData.target_protein}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-200 rounded pl-3 pr-12 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                      placeholder="50"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">g</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg transition-colors ${isSubmitting
                  ? 'bg-green-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl'
                  } text-white font-semibold`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Preferences'}
              </button>

              {apiError && (
                <div className="mt-4 p-4 rounded border border-red-200 bg-red-100">
                  <p className="text-red-600">{apiError}</p>
                </div>
              )}
            </form>
          </div>
        </main>
      </div >
    </div >
  );
}
