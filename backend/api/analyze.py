from pathlib import Path

from fastapi import APIRouter, HTTPException

from services.repository_analyzer import RepositoryAnalyzer

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

    folders = [

        f

        for f in upload_path.iterdir()

        if f.is_dir()

    ]

    repository_root = folders[0] if len(folders) == 1 else upload_path

    analyzer = RepositoryAnalyzer()

    analysis = analyzer.analyze(repository_root)

    analysis_dir = Path("analysis") / project_id

    analyzer.save_analysis(
        analysis,
        analysis_dir
    )

    return {

        "project_id": project_id,

        "repository_name": repository_root.name,

        "total_files": len(
            analysis["inventory"]
        ),

        "technologies": analysis["technologies"],

        "important_files": len(
            analysis["important_files"]
        ),

        "relationships": len(
            analysis["relationships"]
        ),

        "summaries": len(
            analysis["summaries"]
        )

    }