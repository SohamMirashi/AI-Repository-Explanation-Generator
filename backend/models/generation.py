from pydantic import BaseModel


class GenerationRequest(BaseModel):

    project_id: str

    technical_level: str

    product_context: str


class ProgressEvent(BaseModel):

    stage: str

    message: str


class GenerationResponse(BaseModel):

    documentation: str