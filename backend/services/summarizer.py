import json
import re
from pathlib import Path


class RepositorySummarizer:

    FUNCTION_PATTERN = re.compile(
        r"def\s+(\w+)\s*\(|function\s+(\w+)\s*\(|const\s+(\w+)\s*=\s*\("
    )

    CLASS_PATTERN = re.compile(
        r"class\s+(\w+)"
    )

    IMPORT_PATTERN = re.compile(
        r"import\s+.*|from\s+.*"
    )

    def summarize(
        self,
        repository_root: Path,
        important_files: list
    ):

        summaries = []

        for item in important_files:

            file_path = repository_root / item["path"]

            if not file_path.exists():
                continue

            try:

                content = file_path.read_text(
                    encoding="utf-8",
                    errors="ignore"
                )

            except:
                continue

            functions = []

            for match in self.FUNCTION_PATTERN.findall(content):

                for func in match:
                    if func:
                        functions.append(func)

            classes = self.CLASS_PATTERN.findall(content)

            imports = self.IMPORT_PATTERN.findall(content)

            summaries.append({

                "path": item["path"],

                "size": len(content),

                "lines": len(content.splitlines()),

                "functions": functions,

                "classes": classes,

                "imports": len(imports)

            })

        return summaries