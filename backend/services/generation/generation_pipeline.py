import json
from pathlib import Path

from services.generation.progress import ProgressGenerator

from services.generation.batch1 import Batch1Generator
from services.generation.batch2 import Batch2Generator
from services.generation.batch3 import Batch3Generator


class GenerationPipeline:

    async def generate(
        self,
        project_id,
        technical_level,
        product_context
    ):
        
        analysis_path = (
            Path("analysis")
            / project_id
            / "analysis.json"
        )

        yield {
            "event": "progress",
            "data": ProgressGenerator.batch1()
        }

        batch1 = Batch1Generator().generate(
            analysis_path,
            technical_level,
            product_context
        )

        yield {

            "event": "section",

            "data": {

                "title": "batch1",

                "content": batch1

            }

        }

        yield {

            "event": "progress",

            "data": ProgressGenerator.batch2()

        }

        batch2 = Batch2Generator().generate(

            analysis_path,

            technical_level,

            product_context

        )

        yield {

            "event": "section",

            "data": {

                "title": "batch2",

                "content": batch2

            }

        }

        yield {

            "event": "progress",

            "data": ProgressGenerator.batch3()

        }

        batch3 = Batch3Generator().generate(

            analysis_path,

            technical_level,

            product_context

        )

        yield {

            "event": "section",

            "data": {

                "title": "batch3",

                "content": batch3

            }

        }

        yield {

            "event": "completed",

            "data": ProgressGenerator.completed()

        }