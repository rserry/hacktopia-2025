import cpmpy as cp
import pandas as pd
import numpy as np
from collections import Counter

# Load the dataset
plant_data = pd.read_csv("../data/dataset_edible_plants_extendend_v2.csv")
weather_data = pd.read_csv("../data/dataset_weather_extended.csv")

def get_column_data(data, column):
    # Extract the first column
    column_data = data.iloc[:, column]

    # Convert to a list (if needed)
    return column_data.tolist()

def objective_function(pref_crops, av_crops, pref_categories, selected_crops, amnt_chosen, kcal=None, protein=None):
    """
        Objective function to maximize
    """
    w1 = 5  # For preferred crops
    w2 = -10  # For aversion crops
    w3 = 1  # For preferred category
    w4 = -3
    w5 = 5 if kcal is not None else 0
    w6 = 5 if protein is not None else 0

    return cp.sum([w1*pref_crops*selected_crops, 
                   w2*av_crops*selected_crops, 
                   w3*pref_categories*selected_crops,
                   w4*amnt_chosen,
                   w5*abs(kcal_values*selected_crops - kcal),
                   w6*abs(protein_values*selected_crops - protein)])

def most_common_element(lst):
    """
    Returns the most common element in a list.
    If multiple elements have the same highest frequency, it returns one of them.
    
    :param lst: List of elements
    :return: Most common element
    """
    if not lst:
        return None  # Return None if the list is empty
    
    counter = Counter(lst)
    return counter.most_common(1)[0][0]  # Return the most common element


def calc_climate_distance(climate1: int, climate2: int) -> int:
    # climate_order = {"A": 0, "B": 1, "C": 2, "D": 3, "E": 4}
    
    distance_matrix = [
        [0, 3, 2, 4, 5],  # A (Tropical)
        [3, 0, 2, 3, 5],  # B (Dry)
        [2, 2, 0, 2, 4],  # C (Temperate)
        [4, 3, 2, 0, 3],  # D (Continental)
        [5, 5, 4, 3, 0],  # E (Polar)
    ]
    
    # i, j = climate_order[climate1], climate_order[climate2]
    i, j = climate1 - 1, climate2 - 1
    print(f"i is {i}")
    print(f"j is {j.value()}")
    return distance_matrix[i][j]

def map_to_climate_letter(climates):
    # Dictionary to map full climate names to their corresponding letter
    climate_map = {
        "Tropical": "A",
        "Arid": "B",
        "Temperate": "C",
        "Mediterranean": "D",
        "Polar": "E"
    }
    
    # Map the list of climates to their letter category
    climate_letters = [climate_map.get(climate, "Unknown") for climate in climates]
    
    return climate_letters

def map_to_climate_int(climates):
    # Dictionary to map full climate names to their corresponding int
    climate_map = {
        "Tropical": 1,
        "Arid": 2,
        "Temperate": 3,
        "Mediterranean": 4,
        "Polar": 5
    }
    
    # Map the list of climates to their int category
    climate_ints = [climate_map.get(climate, "Unknown") for climate in climates]
    
    return climate_ints

def remove_duplicates_preserve_order(lst):
    seen = set()  # Set to track already seen items
    result = []   # List to store the result
    
    for item in lst:
        if item not in seen:
            result.append(item)
            seen.add(item)  # Mark this item as seen
    
    return result

crops = get_column_data(plant_data, column=0)
categories = get_column_data(plant_data, column=1)
unique_cats, category_numbers = np.unique(categories, return_inverse=True)  # Convert categories to numbers for constraint programming
category_numbers += 1
climates = get_column_data(plant_data, column=3)
climates_as_ints = map_to_climate_int(climates)
climates_as_letters = map_to_climate_letter(climates)
weights = get_column_data(plant_data, column=6)
kcal_values = [int(kcal*10) for kcal in get_column_data(plant_data, column=7)]
protein_values = [int(protein*10) for protein in get_column_data(plant_data, column=8)]
areas = get_column_data(plant_data, column=9)

locations = remove_duplicates_preserve_order(get_column_data(weather_data, column=1))
loc_climates = [c[0] for c in remove_duplicates_preserve_order(get_column_data(weather_data, column=2))]
loc_costs = remove_duplicates_preserve_order(get_column_data(weather_data, column=10))


def get_cheapest_location(climate):
    all_locations = [loc for loc in [l for i, l in enumerate(locations) if loc_climates[i] == climate]]
    filtered_locations = [loc for loc in locations if loc in all_locations]
    filtered_costs = [loc_costs[locations.index(loc)] for loc in filtered_locations]
    
    # Find the index of the minimum cost in the filtered costs
    min_cost_index = filtered_costs.index(min(filtered_costs))
    
    # Return the corresponding location with the lowest cost
    return filtered_locations[min_cost_index]

def find_cheapest_location(locations, costs, input_locations):
    # Filter the locations and costs to include only those in input_locations
    filtered_locations = [loc for loc in locations if loc in input_locations]
    filtered_costs = [costs[locations.index(loc)] for loc in filtered_locations]
    
    # Find the index of the minimum cost in the filtered costs
    min_cost_index = filtered_costs.index(min(filtered_costs))
    
    # Return the corresponding location with the lowest cost
    return filtered_locations[min_cost_index]

def solve_model(pref_crops, av_crops, pref_cats, kcal=None, protein=None):
    # Decision Variables
    selected_crops = cp.boolvar(shape=plant_data.shape[0])
    amnt_crops = cp.intvar(shape=plant_data.shape[0])

    # Model
    model = cp.Model()

    # Constraints
    model += cp.sum(selected_crops) == 10
    model += cp.NValueExcept(selected_crops*category_numbers, 0) == 6

    # Voor objective function
    amnt_chosen_climates = cp.NValueExcept(selected_crops*climates_as_ints, 0)

    # Solve/Optimize
    model.maximize(objective_function(pref_crops, av_crops, pref_cats, selected_crops, amnt_chosen_climates, kcal, protein))
    model.solve()
    return selected_crops.value()

def calculate_result(preferred_categories: set, preferred_crops: set, disliked_crops: list, budget: float, target_calories: float, target_protein: float):
    transformed_preferred_crops = np.isin(crops, list(preferred_crops)).astype(int)
    transformed_aversion_crops = np.isin(crops, list(disliked_crops)).astype(int)
    transformed_categories = np.isin(categories, list(preferred_categories)).astype(int)
    selected_crops = solve_model(transformed_preferred_crops, transformed_aversion_crops, transformed_categories, target_calories*10, target_protein*10)
    crop_names = [crop for i, crop in enumerate(crops) if selected_crops[i]]
    corr_climates = [climate for i, climate in enumerate(climates_as_letters) if selected_crops[i]]
    area = [a for i, a in enumerate(areas) if selected_crops[i]]
    no_b_climates = [c for c in corr_climates if c != "B"]
    common_climate = most_common_element(no_b_climates)
    good_location = get_cheapest_location(common_climate)
    calories = sum(kcal_values*selected_crops)
    protein = sum(protein_values*selected_crops)
    print(protein/10)
    result = (good_location, {c:area[i] for i,c in enumerate(crop_names)})
    return result

print(calculate_result({"Fruits & Berries"}, {"Mango", "Papaya", "Spinach"}, {}, 10000, 3000, 100))

# print(get_cheapest_location("B"))