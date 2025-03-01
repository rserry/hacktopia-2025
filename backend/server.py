from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()

class InputData(BaseModel):
    preferred_categories: List[str]
    preferred_crops: List[str]
    disliked_crops: List[str]
    budget: float
    target_calories: float
    target_protein: float

@app.post("/calculate")
async def calculate(input_data: InputData):
    try:
        result = 