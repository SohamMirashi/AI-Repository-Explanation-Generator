import json

from sse_starlette.sse import EventSourceResponse

from services.generation.generation_pipeline import GenerationPipeline


class GenerationStreamer:

    async def stream(
        self,
        project_id: str,
        technical_level: str,
        product_context: str
    ):

        async def event_generator():

            pipeline = GenerationPipeline()

            async for item in pipeline.generate(
                project_id,
                technical_level,
                product_context
            ):

                yield {
                    "event": item["event"],
                    "data": json.dumps(item["data"])
                }

        return EventSourceResponse(event_generator())