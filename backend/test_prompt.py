import json

from services.generation.prompts import PromptBuilder

with open(
    "analysis/613029de-6440-481b-bd0d-856ef6c03f2e/analysis.json",
    "r",
    encoding="utf-8"
) as f:

    analysis = json.load(f)

system = PromptBuilder.load_prompt(
    "system.md"
)

batch = PromptBuilder.load_prompt(
    "batch1.md"
)

context = PromptBuilder.build_context(

    analysis,

    "Beginner",

    "Hospital Management System"

)

print(system)

print(context)

print(batch)