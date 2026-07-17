import re
from pathlib import Path


class RelationshipMapper:

    IMPORT_PATTERN = re.compile(
        r'import\s+(?:.+?\s+from\s+)?[\'"](.+?)[\'"]'
    )

    REQUIRE_PATTERN = re.compile(
        r'require\([\'"](.+?)[\'"]\)'
    )

    PYTHON_IMPORT = re.compile(
        r'from\s+([a-zA-Z0-9_.]+)\s+import|import\s+([a-zA-Z0-9_.]+)'
    )

    def detect(self, repository_root: Path):

        relationships = []

        for file in repository_root.rglob("*"):

            if not file.is_file():
                continue

            if file.suffix.lower() not in {
                ".py",
                ".js",
                ".jsx",
                ".ts",
                ".tsx"
            }:
                continue

            try:

                content = file.read_text(
                    encoding="utf-8",
                    errors="ignore"
                )

            except:

                continue

            imports = []

            imports.extend(self.IMPORT_PATTERN.findall(content))

            imports.extend(self.REQUIRE_PATTERN.findall(content))

            for match in self.PYTHON_IMPORT.findall(content):

                for item in match:

                    if item:
                        imports.append(item)

            for imported in imports:

                relationships.append({

                    "source": str(file.relative_to(repository_root)),

                    "relationship": "imports",

                    "target": imported

                })

        return relationships