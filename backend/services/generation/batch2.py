import json

from pathlib import Path

from services.generation.prompts import PromptBuilder
from services.generation.llm_client import LLMClient


class Batch2Generator:

    def generate(

        self,

        analysis_path: Path,

        technical_level: str,

        product_context: str

    ):

        with open(
            analysis_path,
            "r",
            encoding="utf-8"
        ) as f:

            analysis = json.load(f)

        # system_prompt = PromptBuilder.load_prompt(
        #     "system.md"
        # )

        system_prompt = (
            PromptBuilder.load_prompt("system.md")
            + "\n\n"
            + PromptBuilder.load_level_prompt(
                technical_level
            )
        )

        batch_prompt = PromptBuilder.load_prompt(
            "batch2.md"
        )

        context = PromptBuilder.build_context(

            analysis,

            technical_level,

            product_context

        )

        user_prompt = context + "\n\n" + batch_prompt

        client = LLMClient()

        return client.generate(

            system_prompt,

            user_prompt

        )