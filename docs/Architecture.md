# RepoInsight Architecture

## Overview

RepoInsight analyzes uploaded repositories and generates AI-powered documentation.

---

## Architecture

```
User

↓

Next.js Frontend

↓

FastAPI Backend

↓

Repository Analysis Pipeline

↓

Prompt Generation

↓

OpenRouter LLM

↓

Streaming Documentation

↓

Markdown + Mermaid

↓

ZIP Download
```

---

## Frontend

- Next.js
- TypeScript
- Tailwind CSS

Responsibilities

- Upload repository
- Stream documentation
- Render Markdown
- Render Mermaid
- Download documentation

---

## Backend

FastAPI

Responsibilities

- Repository upload
- Repository extraction
- Repository analysis
- Prompt construction
- LLM communication
- Streaming responses
- ZIP generation

---

## AI Pipeline

Upload ZIP

↓

Extract Repository

↓

Analyze Files

↓

Detect Technologies

↓

Generate Batch 1

↓

Generate Batch 2

↓

Generate Batch 3

↓

Combine Markdown

↓

Create ZIP

↓

Return Download Link