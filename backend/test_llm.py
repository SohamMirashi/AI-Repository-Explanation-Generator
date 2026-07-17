from services.generation.llm_client import LLMClient

client = LLMClient()

response = client.generate(
    """
Explain what FastAPI is in two short paragraphs.
"""
)

print(response)