import uuid
import zipfile
import shutil

from pathlib import Path
from fastapi import UploadFile, HTTPException


def detect_repository_root(self, project_folder: Path) -> Path:
    """
    Detect the actual repository root after extraction.
    """

    items = [
        item for item in project_folder.iterdir()
        if item.name != ".DS_Store"
    ]

    # Ignore the uploaded ZIP file
    folders = [item for item in items if item.is_dir()]

    if len(folders) == 1:
        return folders[0]

    return project_folder


class RepositoryExtractor:

    def detect_repository_root(self, project_folder: Path) -> Path:
        """
        Detect the actual repository root after extraction.
        """
    
        items = [
            item for item in project_folder.iterdir()
            if item.name != ".DS_Store"
        ]
    
        # Ignore the uploaded ZIP file
        folders = [item for item in items if item.is_dir()]
    
        if len(folders) == 1:
            return folders[0]
    
        return project_folder

    def __init__(self):

        self.upload_dir = Path("uploads")

        self.upload_dir.mkdir(exist_ok=True)

    async def extract_repository(self, file: UploadFile):

        # Validate extension
        if not file.filename.endswith(".zip"):
            raise HTTPException(
                status_code=400,
                detail="Only ZIP repositories are supported."
            )

        project_id = str(uuid.uuid4())

        project_folder = self.upload_dir / project_id

        project_folder.mkdir(parents=True, exist_ok=True)

        zip_path = project_folder / file.filename

        with open(zip_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        with zipfile.ZipFile(zip_path, "r") as zip_ref:
            zip_ref.extractall(project_folder)
            repository_root = self.detect_repository_root(project_folder)

        return {
            "project_id": project_id,
            "repository_root": str(repository_root),
            "repository_name": repository_root.name,
            "status": "Repository uploaded successfully"
        }
    

