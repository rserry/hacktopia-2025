'use client';
import { useState, useEffect } from "react";
import Select from 'react-select';
import { loadPlantData } from '@/utils/plantData';
import type { PlantData } from '@/utils/plantData';

type Option = {
  value: string;
  label: string;
  data?: PlantData;
};

export default function Home() {
  const [plantData, setPlantData] = useState<PlantData[]>([]);
  const [formData, setFormData] = useState({
    category: '',
    likedPlants: '',
    dislikedPlants: '',
    budget: '',
    area: '',
    targetCalories: '',
    targetProtein: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadPlantData();
        setPlantData(data);
      } catch (error) {
        console.error('Error loading plant data:', error);
      }
    };
    fetchData();
  }, []);

  // Create memoized options for categories and plants
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

  const handleSelectChange = (selectedOption: Option | null, actionMeta: { name?: string }) => {
    if (!selectedOption || !actionMeta.name) return;

    setFormData(prev => ({
      ...prev,
      [actionMeta.name as string]: selectedOption.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Preferences submitted successfully!');
      } else {
        throw new Error('Failed to submit preferences');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit preferences');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Plant Preferences</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="category" className="block mb-2 font-medium">Plant Category</label>
            <Select
              id="category"
              name="category"
              value={categoryOptions.find(opt => opt.value === formData.category)}
              onChange={(opt) => handleSelectChange(opt, { name: 'category' })}
              options={categoryOptions}
              className="react-select"
              placeholder="Search or select a category"
              isClearable
              isSearchable
              required
            />
          </div>

          <div>
            <label htmlFor="likedPlants" className="block mb-2 font-medium">Preferred Plants</label>
            <Select
              id="likedPlants"
              name="likedPlants"
              value={plantOptions.find(opt => opt.value === formData.likedPlants)}
              onChange={(opt) => handleSelectChange(opt, { name: 'likedPlants' })}
              options={plantOptions}
              className="react-select"
              placeholder="Search or select preferred plants"
              isClearable
              isSearchable
              required
            />
          </div>

          <div>
            <label htmlFor="dislikedPlants" className="block mb-2 font-medium">Disliked Plants</label>
            <Select
              id="dislikedPlants"
              name="dislikedPlants"
              value={plantOptions.find(opt => opt.value === formData.dislikedPlants)}
              onChange={(opt) => handleSelectChange(opt, { name: 'dislikedPlants' })}
              options={plantOptions}
              className="react-select"
              placeholder="Search or select disliked plants"
              isClearable
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              />
            </div>

            <div>
              <label htmlFor="area" className="block mb-2 font-medium">Area (m²)</label>
              <input
                type="number"
                id="area"
                name="area"
                min="0"
                value={formData.area}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="targetCalories" className="block mb-2 font-medium">Target Calories</label>
              <input
                type="number"
                id="targetCalories"
                name="targetCalories"
                min="0"
                value={formData.targetCalories}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label htmlFor="targetProtein" className="block mb-2 font-medium">Target Protein (g)</label>
              <input
                type="number"
                id="targetProtein"
                name="targetProtein"
                min="0"
                value={formData.targetProtein}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
          >
            Submit Preferences
          </button>
        </form>
      </main>
    </div>
  );
}
