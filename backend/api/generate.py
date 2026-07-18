from fastapi import APIRouter

from models.generation import GenerationRequest
from services.generation.stream import GenerationStreamer


router = APIRouter(
    prefix="/generate",
    tags=["Generation"]
)


@router.post("/stream")
async def stream(request: GenerationRequest):

    streamer = GenerationStreamer()

    return await streamer.stream(
        request.project_id,
        request.technical_level,
        request.product_context
    )