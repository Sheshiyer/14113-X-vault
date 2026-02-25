import zvec
import sys
import os
import random
import shutil

# Mock embedding generator (since we might not have a model installed yet)
# In production, replace with:
# from sentence_transformers import SentenceTransformer
# model = SentenceTransformer('all-MiniLM-L6-v2')
# def get_embedding(text): return model.encode(text).tolist()

def get_dummy_embedding(dim=4):
    return [random.random() for _ in range(dim)]

def main():
    print("Initializing Zvec...")
    
    # Define collection schema
    # Using 4 dimensions for dummy embeddings
    dim = 4 
    schema = zvec.CollectionSchema(
        name="vault_index",
        vectors=zvec.VectorSchema("embedding", zvec.DataType.VECTOR_FP32, dim),
    )

    # Create collection
    db_path = "./_System/zvec_data"
    
    # Clean up previous run if exists
    if os.path.exists(db_path):
        print(f"Removing existing DB at {db_path}")
        shutil.rmtree(db_path)
    
    try:
        collection = zvec.create_and_open(path=db_path, schema=schema)
        print(f"Collection created at {db_path}")

        # Read a sample file
        sample_file = "03-Resources/Health-Library-Index.md"
        if not os.path.exists(sample_file):
            print(f"File {sample_file} not found. Creating dummy data.")
            content = "This is a dummy content for testing Zvec.\nIt supports vector search."
        else:
            print(f"Reading {sample_file}...")
            with open(sample_file, 'r') as f:
                content = f.read()

        # Simple chunking (by line for this test)
        lines = [line.strip() for line in content.split('\n') if line.strip()]
        docs = []
        
        print(f"Indexing {len(lines)} chunks (limiting to first 10 for test)...")
        
        for i, line in enumerate(lines[:10]): # Index first 10 lines for test
            vec = get_dummy_embedding(dim)
            # Assuming Doc takes id, vectors, and fields
            # Based on typical vector DB APIs and the README
            docs.append(zvec.Doc(id=f"doc_{i}", vectors={"embedding": vec}, fields={"text": line}))
        
        # Insert documents
        collection.insert(docs)
        print("Insertion complete.")

        # Search
        print("Performing search...")
        query_vec = get_dummy_embedding(dim)
        results = collection.query(
            zvec.VectorQuery("embedding", vector=query_vec),
            topk=3
        )

        print("Search Results:")
        for res in results:
            print(f"ID: {res.id}, Score: {res.score}")
            # Try to print fields if accessible
            try:
                if hasattr(res, 'fields'):
                    print(f"Fields: {res.fields}")
            except:
                pass

    except Exception as e:
        print(f"An error occurred: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
