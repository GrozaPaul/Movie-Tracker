#!/usr/bin/env python3
from sentence_transformers import SentenceTransformer
import psycopg2
import json
import os
from dotenv import load_dotenv

load_dotenv()

def main():
    print("--- Starting embedding generation ---")
    model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

    db_config = {
        'host': 'localhost',
        'port': 5432,
        'database': os.getenv('DB_NAME', 'movie_db'),
        'user': os.getenv('DB_USER', 'postgres'),
        'password': os.getenv('DB_PASSWORD', 'postgres')
    }

    print(f"--- Connecting to db at {db_config['host']}:{db_config['port']} ---")
    try:
        conn = psycopg2.connect(**db_config)
        cur = conn.cursor()
        print("--- Connected successfully ---")
    except Exception as e:
        print(f"--- Connection failed: {e} ---")
        return

    cur.execute("""
        SELECT COUNT(*) 
        FROM movie 
        WHERE overview IS NOT NULL 
        AND overview != '' 
        AND embedding_json IS NULL 
    """)
    total_count = cur.fetchone()[0]

    if total_count == 0:
        print("--- All existing movies already have embeddings ---")
        cur.close()
        conn.close()
        return

    print(f"--- Found {total_count} movies with overview and without embeddings ---")

    cur.execute("""
    SELECT movie_id, overview
    FROM movie
    WHERE overview IS NOT NULL
    AND overview != ''
    AND embedding_json IS NULL
    ORDER BY movie_id
    """)

    movies = cur.fetchall()

    batch_size = 100
    total_processed = 0

    for i in range(0, len(movies), batch_size):
        batch = movies[i:i + batch_size]

        movie_ids = [movie[0] for movie in batch]
        overviews = [movie[1] for movie in batch]

        print(f"--- Generating embeddings for batch {i//batch_size + 1} ---")
        embeddings = model.encode(
            overviews,
            show_progress_bar=False,
            convert_to_numpy=True
        )

        for movie_id, embedding in zip(movie_ids, embeddings):
            embedding_list = embedding.tolist() # from numpy array to list
            embedding_json = json.dumps(embedding_list)

            cur.execute(
                "UPDATE movie SET embedding_json = %s WHERE movie_id = %s",
                (embedding_json, movie_id)
            )

        conn.commit()
        total_processed += len(batch)

        progress = (total_processed / total_count) * 100
        print(f"--- Progress: {total_processed}/{total_count} ({progress:.1f}%) ---")

    cur.close()
    conn.close()

    print(f"--- Successfully generated embeddings for {total_processed} movies! ---")

if __name__ == "__main__":
    main()
