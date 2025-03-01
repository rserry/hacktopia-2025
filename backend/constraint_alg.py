import cpmpy as cp
import pandas as pd

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
