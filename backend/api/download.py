from pathlib import Path
from zipfile import ZipFile
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

router = APIRouter()


@router.get("/download/{project_id}")
async def download_documentation(project_id: str):

    generated_folder = Path("generated") / project_id

    if not generated_folder.exists():
        raise HTTPException(
            status_code=404,
            detail="Generated documentation not found."
        )

    zip_path = generated_folder / "documentation.zip"

    with ZipFile(zip_path, "w") as zip_file:

        for file in generated_folder.iterdir():

            if file.name == "documentation.zip":
                continue
            
            if file.is_file():
                zip_file.write(
                    file,
                    arcname=file.name
                )

    return FileResponse(
        zip_path,
        filename="documentation.zip",
        media_type="application/zip"
    )