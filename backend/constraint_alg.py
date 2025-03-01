import cpmpy as cp
import pandas as pd
<<<<<<< HEAD
import numpy as np

# Load the dataset
plant_data = pd.read_csv("../data/dataset_edible_plants_extendend_v2.csv")

def get_column_data(data, column):
    # Extract the first column
    column_data = data.iloc[:, column]

    # Convert to a list (if needed)
    return column_data.tolist()

def objective_function(pref_crops, av_crops, pref_categories, selected_crops):
    """
        Objective function to minimize
    """
    w1 = 5  # For preferred crops
    w2 = -10  # For aversion crops
    w3 = 1  # For preferred category
    # print(cp.sum(pref_crops*selected_crops))
    return cp.sum([w1*pref_crops*selected_crops, w2*av_crops*selected_crops, w3*pref_categories*selected_crops])

crops = get_column_data(plant_data, column=0)
categories = get_column_data(plant_data, column=1)
unique_cats, category_numbers = np.unique(categories, return_inverse=True)  # Convert categories to numbers for constraint programming
category_numbers += 1
climates = get_column_data(plant_data, column=3)
weights = get_column_data(plant_data, column=6)
kcals = get_column_data(plant_data, column=7)
proteins = get_column_data(plant_data, column=8)
areas = get_column_data(plant_data, column=9)

def solve_model(pref_crops, av_crops, pref_cats):
    # Decision Variables
    selected_crops = cp.boolvar(shape=plant_data.shape[0])

    # Input Variables
    # preferred_crops = cp.boolvar(shape=plant_data.shape[0])
    # preferred_categories = cp.boolvar(shape=plant_data.shape[0])
    # aversion_crops = cp.boolvar(shape=plant_data.shape[0])
    # wanted_kcals = cp.intvar(0, 10000, shape=1)
    # wanted_protein = cp.intvar(0, 300, shape=1)
    # budget = cp.intvar(0, 500000, shape=1)

    # Model
    model = cp.Model()

    # Constraints
    model += cp.sum(selected_crops) == 10
    model += cp.NValueExcept(selected_crops*category_numbers, 0) == 6
    # model += cp.NValueExcept(selected_crops*category_numbers, 0) >= 5  # TODO: change

    # Objective function
    # obj_value = objective_function(pref_crops, av_crops, pref_cats, selected_crops)

    w1 = 5  # For preferred crops
    w2 = -10  # For aversion crops
    w3 = 1  # For preferred category
    # Solve/Optimize
    model.maximize(cp.sum([w1*pref_crops*selected_crops, w2*av_crops*selected_crops, w3*pref_cats*selected_crops]))
    # model.minimize(cp.sum(selected_crops))
    # model.solve()
    model.solve()
    print(selected_crops.value())
    print([crop for i, crop in enumerate(crops) if selected_crops[i].value()])

def calculate_result(preferred_categories: set, preferred_crops: set, disliked_crops: list, budget: float, target_calories: float, target_protein: float):
    transformed_preferred_crops = np.isin(crops, list(preferred_crops)).astype(int)
    transformed_aversion_crops = np.isin(crops, list(disliked_crops)).astype(int)
    transformed_categories = np.isin(categories, list(preferred_categories)).astype(int)
    result = solve_model(transformed_preferred_crops, transformed_aversion_crops, transformed_categories)
    result: tuple[str, dict[str, int]] = ("A", {"B": 10, "C": 20})
    return result

calculate_result({"Fruits & Berries"}, {"Wolfberry", "Pea Shoots", "Apple"}, {"Papaya"}, 10000, 3000, 150)
=======

# Load the dataset
data = pd.read_csv("../data/dataset_edible_plants_extendend_v2.csv")

def get_crops(data):
    # Extract the first column
    first_column = data.iloc[:, 0]

    # Convert to a list (if needed)
    return first_column.tolist()


crops = get_crops()
print(crops)

# Decision Variables
selected_crops = cp.boolvar(shape=data.shape[0])

# Input Variables
# preferred_crops = ...
# aversion_crops = ...
# wanted_kcals = ...
# wanted_protein = ...
# budget = ...


# Model
model = cp.Model()

def calculate_result(preferred_categories: list, preferred_crops: list, disliked_crops: list, budget: float, target_calories: float, target_protein: float):
    result: tuple[str, dict[str, int]] = ("A", {"B": 10, "C": 20})
    return result
>>>>>>> bd33f27041d968e6e50eda6c95f56c4950a5777b
