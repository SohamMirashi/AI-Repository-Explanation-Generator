import json

from services.generation.prompts import PromptBuilder

project_id = "613029de-6440-481b-bd0d-856ef6c03f2e"   # Replace with your project id

with open(f"analysis/{project_id}/analysis.json", "r", encoding="utf-8") as f:
    analysis = json.load(f)

prompt = PromptBuilder.build_batch1_prompt(
    analysis=analysis,
    technical_level="Beginner",
    product_context="Hospital Management System"
)

print(prompt)