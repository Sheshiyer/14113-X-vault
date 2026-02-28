# Meru Indexer Runtime (P1-S1-08)
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y 
    build-essential 
    libgomp1 
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY _System/scripts/memory/requirements-memory.txt .
RUN pip install --no-cache-dir -r requirements-memory.txt

# Copy source scripts (we assume vault is mounted at /vault)
COPY _System/scripts/memory/ /app/scripts/

ENV PYTHONPATH=/app/scripts
ENV VAULT_PATH=/vault

ENTRYPOINT ["python", "/app/scripts/update_index.py"]
