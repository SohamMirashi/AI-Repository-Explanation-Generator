from pathlib import Path

from services.generation.progress import ProgressGenerator
from services.generation.batch1 import Batch1Generator
from services.generation.batch2 import Batch2Generator
from services.generation.batch3 import Batch3Generator


class GenerationPipeline:

    async def generate(
        self,
        project_id: str,
        technical_level: str,
        product_context: str
    ):

        analysis_path = (
            Path("analysis")
            / project_id
            / "analysis.json"
        )

        output_directory = (
            Path("generated")
            / project_id
        )

        output_directory.mkdir(
            parents=True,
            exist_ok=True
        )

        batches = [

            {
                "progress": ProgressGenerator.batch1(),
                "title": "Start Here & Product Overview",
                "filename": "batch1.md",
                "generator": Batch1Generator()
            },

            {
                "progress": ProgressGenerator.batch2(),
                "title": "Technology Stack & Architecture",
                "filename": "batch2.md",
                "generator": Batch2Generator()
            },

            {
                "progress": ProgressGenerator.batch3(),
                "title": "Repository Guide & Risks",
                "filename": "batch3.md",
                "generator": Batch3Generator()
            }

        ]

        for batch in batches:

            yield {

                "event": "progress",

                "data": batch["progress"]

            }

            try:

                content = batch["generator"].generate(

                    analysis_path,

                    technical_level,

                    product_context

                )

                with open(

                    output_directory / batch["filename"],

                    "w",

                    encoding="utf-8"

                ) as f:

                    f.write(content)

                yield {

                    "event": "section",

                    "data": {

                        "title": batch["title"],

                        "content": content

                    }

                }

            except Exception as e:

                yield {

                    "event": "error",

                    "data": {

                        "title": batch["title"],

                        "message": str(e)

                    }

                }

        yield {

            "event": "completed",

            "data": ProgressGenerator.completed()

        }