from pathlib import Path
import json


class PromptBuilder:

    PROMPT_DIR = Path("prompts")

    @staticmethod
    def load_prompt(filename: str):

        with open(
            PromptBuilder.PROMPT_DIR / filename,
            "r",
            encoding="utf-8"
        ) as f:

            return f.read()
        

    @staticmethod
    def load_level_prompt(level: str):

        level = level.lower()

        mapping = {
            "beginner": "beginner.md",
            "product": "product.md",
            "developer": "developer.md"
        }

        filename = mapping.get(level, "beginner.md")

        with open(
            PromptBuilder.PROMPT_DIR / "levels" / filename,
            "r",
            encoding="utf-8"
        ) as f:

            return f.read()
        
    @staticmethod
    def build_context(

        analysis,

        technical_level,

        product_context

    ):

        return f"""

USER TECHNICAL LEVEL
{technical_level}
------------------------------------------------
PRODUCT CONTEXT
{product_context}
------------------------------------------------
REPOSITORY ANALYSIS
{json.dumps(analysis, indent=2)}
"""