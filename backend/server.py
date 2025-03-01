from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from constraint_alg import calculate_result

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=["GET", "POST", "PUT", "DELETE"]
)

class InputData(BaseModel):
    preferred_categories: List[str]
    preferred_crops: List[str]
    disliked_crops: List[str]
    budget: float
    target_calories: float | None
    target_protein: float | None

@app.post("/calculate")
async def calculate(input_data: InputData):
    try:
        result = calculate_result(input_data.preferred_categories, input_data.preferred_crops, input_data.disliked_crops, input_data.budget, input_data.target_calories, input_data.target_protein)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))