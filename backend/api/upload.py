from fastapi import APIRouter, UploadFile, File, HTTPException
from services.extractor import RepositoryExtractor

router = APIRouter(prefix="/upload", tags=["Upload"])


@router.post("/")
async def upload_repository(file: UploadFile = File(...)):
    extractor = RepositoryExtractor()

    result = await extractor.extract_repository(file)

    return result