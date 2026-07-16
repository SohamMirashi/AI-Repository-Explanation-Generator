from pathlib import Path
import json

from fastapi import APIRouter, HTTPException

from services.inventory import RepositoryInventory
from services.technology_detector import TechnologyDetector
from services.important_files import ImportantFileDetector
from services.relationship_mapper import RelationshipMapper
from services.summarizer import RepositorySummarizer


router = APIRouter(
    prefix="/analyze",
    tags=["Analysis"]
)


@router.post("/{project_id}")
async def analyze_repository(project_id: str):

    upload_path = Path("uploads") / project_id

    if not upload_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Project not found."
        )

    folders = [f for f in upload_path.iterdir() if f.is_dir()]

    if len(folders) == 1:
        repository_root = folders[0]
    else:
        repository_root = upload_path

    scanner = RepositoryInventory()
    inventory = scanner.scan_repository(repository_root)

    detector = TechnologyDetector()
    technologies = detector.detect(repository_root)

    important_detector = ImportantFileDetector()
    important_files = important_detector.detect(repository_root)

    relationship_detector = RelationshipMapper()
    relationships = relationship_detector.detect(repository_root)

    summarizer = RepositorySummarizer()
    summaries = summarizer.summarize(
        repository_root,
        important_files
    )

    analysis_dir = Path("analysis") / project_id
    analysis_dir.mkdir(parents=True, exist_ok=True)

    with open(analysis_dir / "inventory.json", "w", encoding="utf-8") as f:
        json.dump(inventory, f, indent=4)

    with open(analysis_dir / "technologies.json", "w", encoding="utf-8") as f:
        json.dump(technologies, f, indent=4)

    with open(analysis_dir / "important_files.json", "w", encoding="utf-8") as f:
        json.dump(important_files, f, indent=4)

    with open(analysis_dir / "relationships.json", "w", encoding="utf-8") as f:
        json.dump(relationships, f, indent=4)

    with open(analysis_dir / "summaries.json", "w", encoding="utf-8") as f:
        json.dump(summaries, f, indent=4)

    return {
        "project_id": project_id,
        "repository_name": repository_root.name,
        "total_files": len(inventory),
        "technologies_detected": technologies,
        "important_files_found": len(important_files),
        "relationships_found": len(relationships),
        "summaries_generated": len(summaries),
        "top_10_files": important_files[:10]
    }