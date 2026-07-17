import json

from pathlib import Path

from services.analyze.inventory import RepositoryInventory
from services.analyze.technology_detector import TechnologyDetector
from services.analyze.important_files import ImportantFileDetector
from services.analyze.relationship_mapper import RelationshipMapper
from services.analyze.summarizer import RepositorySummarizer


class RepositoryAnalyzer:

    def analyze(self, repository_root: Path):

        inventory = RepositoryInventory().scan_repository(repository_root)

        technologies = TechnologyDetector().detect(repository_root)

        important_files = ImportantFileDetector().detect(repository_root)

        relationships = RelationshipMapper().detect(repository_root)

        summaries = RepositorySummarizer().summarize(
            repository_root,
            important_files
        )

        return {

            "inventory": inventory,

            "technologies": technologies,

            "important_files": important_files,

            "relationships": relationships,

            "summaries": summaries

        }

    def save_analysis(
        self,
        analysis,
        analysis_dir: Path
    ):

        analysis_dir.mkdir(
            parents=True,
            exist_ok=True
        )

        with open(
            analysis_dir / "analysis.json",
            "w",
            encoding="utf-8"
        ) as f:

            json.dump(
                analysis,
                f,
                indent=4
            )