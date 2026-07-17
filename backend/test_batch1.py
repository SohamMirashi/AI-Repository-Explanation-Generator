from pathlib import Path

from services.generation.batch1 import Batch1Generator

project_id = "ca5e82b3-7750-473f-b87f-75288a9bb541"

analysis_path = Path(
    f"analysis/{project_id}/analysis.json"
)

generator = Batch1Generator()

result = generator.generate(

    analysis_path,

    # technical_level="Beginner",
    # technical_level="Product",
    technical_level="Developer",

    product_context="Hospital Management System"

)

print(result)