from pathlib import Path


class RepositoryInventory:

    IGNORE_FOLDERS = {
        ".git",
        ".github",
        ".next",
        ".idea",
        ".vscode",
        "__pycache__",
        "node_modules",
        "venv",
        ".venv",
        "dist",
        "build"
    }

    IGNORE_FILES = {
        ".DS_Store"
    }

    IGNORE_EXTENSIONS = {
        ".png",
        ".jpg",
        ".jpeg",
        ".gif",
        ".svg",
        ".ico",
        ".pdf",
        ".zip",
        ".exe",
        ".dll"
    }

    LANGUAGE_MAP = {
        ".py": "Python",
        ".js": "JavaScript",
        ".ts": "TypeScript",
        ".jsx": "React JavaScript",
        ".tsx": "React TypeScript",
        ".java": "Java",
        ".cpp": "C++",
        ".c": "C",
        ".cs": "C#",
        ".go": "Go",
        ".php": "PHP",
        ".html": "HTML",
        ".css": "CSS",
        ".json": "JSON",
        ".md": "Markdown",
        ".yml": "YAML",
        ".yaml": "YAML",
        ".xml": "XML",
        ".sql": "SQL"
    }

    def scan_repository(self, repository_root: Path):

        inventory = []

        for file in repository_root.rglob("*"):

            if not file.is_file():
                continue

            if any(folder in file.parts for folder in self.IGNORE_FOLDERS):
                continue

            if file.name in self.IGNORE_FILES:
                continue

            if file.suffix.lower() in self.IGNORE_EXTENSIONS:
                continue

            inventory.append({
                "path": str(file.relative_to(repository_root)),
                "name": file.name,
                "extension": file.suffix.lower(),
                "language": self.LANGUAGE_MAP.get(file.suffix.lower(), "Unknown"),
                "size": file.stat().st_size
            })

        return inventory