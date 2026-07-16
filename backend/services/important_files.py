from pathlib import Path


class ImportantFileDetector:

    IMPORTANT_NAMES = {
        "package.json",
        "package-lock.json",
        "README.md",
        "requirements.txt",
        "pyproject.toml",
        "Dockerfile",
        "docker-compose.yml",
        ".env.example",
        ".env",
        "main.py",
        "app.py",
        "server.js",
        "index.js",
        "manage.py"
    }

    IMPORTANT_FOLDERS = {
        "src",
        "app",
        "backend",
        "frontend",
        "routes",
        "controllers",
        "services",
        "models",
        "pages",
        "components",
        "api",
        "database",
        "config"
    }

    def detect(self, repository_root: Path):

        important_files = []

        for file in repository_root.rglob("*"):

            if not file.is_file():
                continue

            score = 0

            if file.name in self.IMPORTANT_NAMES:
                score += 100

            for folder in file.parts:
                if folder.lower() in self.IMPORTANT_FOLDERS:
                    score += 20

            if file.suffix in [".py", ".js", ".ts", ".tsx", ".jsx"]:
                score += 10

            if score > 0:

                important_files.append({
                    "path": str(file.relative_to(repository_root)),
                    "name": file.name,
                    "score": score
                })

        important_files.sort(
            key=lambda x: x["score"],
            reverse=True
        )

        return important_files