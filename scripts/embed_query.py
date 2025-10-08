# scripts/embed_query.py
import sys
import json
import requests

URL = "https://model-apis.semanticscholar.org/specter/v1/invoke"
MAX_BATCH_SIZE = 16

def chunks(lst, chunk_size=MAX_BATCH_SIZE):
    for i in range(0, len(lst), chunk_size):
        yield lst[i : i + chunk_size]

def embed(papers):
    embeddings_by_paper_id = {}
    for chunk in chunks(papers):
        response = requests.post(URL, json=chunk)
        if response.status_code != 200:
            raise RuntimeError(f"SPECTER API error: {response.status_code} {response.text}")
        for paper in response.json()["preds"]:
            embeddings_by_paper_id[paper["paper_id"]] = paper["embedding"]
    return embeddings_by_paper_id

if __name__ == "__main__":
    # Read JSON input from stdin
    input_data = json.load(sys.stdin)
    embeddings = embed(input_data)

    # Save embeddings to file
    with open("query_embedding.json", "w") as f:
        json.dump(embeddings, f, indent=2)

    print("✅ Embedding saved:", embeddings)
