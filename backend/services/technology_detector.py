import json
from pathlib import Path


class TechnologyDetector:

    def detect(self, repository_root: Path):

        technologies = {
            "frontend": [],
            "backend": [],
            "database": [],
            "ai": [],
            "containerization": [],
            "package_manager": [],
            "languages": []
        }

        package_json = repository_root / "package.json"

        if package_json.exists():

            with open(package_json, "r", encoding="utf-8") as f:
                package = json.load(f)

            deps = {}

            deps.update(package.get("dependencies", {}))
            deps.update(package.get("devDependencies", {}))

            packages = set(deps.keys())

            technologies["package_manager"].append("npm")
            technologies["languages"].append("JavaScript")

            if "react" in packages:
                technologies["frontend"].append("React")

            if "next" in packages:
                technologies["frontend"].append("Next.js")

            if "vue" in packages:
                technologies["frontend"].append("Vue")

            if "express" in packages:
                technologies["backend"].append("Express")

            if "mongoose" in packages:
                technologies["database"].append("MongoDB")

            if "pg" in packages:
                technologies["database"].append("PostgreSQL")

            if "mysql2" in packages:
                technologies["database"].append("MySQL")

            if "openai" in packages:
                technologies["ai"].append("OpenAI")

            if "langchain" in packages:
                technologies["ai"].append("LangChain")

        requirements = repository_root / "requirements.txt"

        if requirements.exists():

            technologies["languages"].append("Python")

            content = requirements.read_text(encoding="utf-8").lower()

            if "fastapi" in content:
                technologies["backend"].append("FastAPI")

            if "flask" in content:
                technologies["backend"].append("Flask")

            if "django" in content:
                technologies["backend"].append("Django")

            if "openai" in content:
                technologies["ai"].append("OpenAI")

            if "langchain" in content:
                technologies["ai"].append("LangChain")

            if "pymongo" in content:
                technologies["database"].append("MongoDB")

            if "psycopg2" in content:
                technologies["database"].append("PostgreSQL")

        dockerfile = repository_root / "Dockerfile"

        if dockerfile.exists():
            technologies["containerization"].append("Docker")

        docker_compose = repository_root / "docker-compose.yml"

        if docker_compose.exists():
            technologies["containerization"].append("Docker Compose")

        for key in technologies:
            technologies[key] = sorted(list(set(technologies[key])))

        return technologies