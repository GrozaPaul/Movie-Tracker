#!/usr/bin/env python3

import sys
import json
import os

# Suppress all output before importing the model
os.environ["TOKENIZERS_PARALLELISM"] = "false"
import logging
logging.disable(logging.CRITICAL)

from sentence_transformers import SentenceTransformer

def generate_single_embedding(text):
    model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2', device='cpu')
    embedding = model.encode(text, convert_to_numpy=True, show_progress_bar=False)
    return embedding.tolist()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Query text required"}))
        sys.exit(1)

    query = sys.argv[1]

    try:
        embedding = generate_single_embedding(query)
        print(json.dumps(embedding))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)