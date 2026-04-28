from pydantic import BaseModel, EmailStr
from typing import Dict, Any, Optional
from datetime import datetime

class ReportRequest(BaseModel):
    email: EmailStr
    name: str
    report_title: str = "Food Analysis Report"
    ml_results: Dict[str, Any]
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "name": "Jane Doe",
                "report_title": "Metabolic Stress Prediction",
                "ml_results": {
                    "Prediction": "Medium Risk",
                    "Score": 0.75,
                    "Recommendation": "Increase fiber intake."
                }
            }
        }
