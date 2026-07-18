


# Global variables for models (initially None)
nlp = None
embedder = None
kw_model = None

def get_models():
    """Lazy loads the models only when they are first needed."""
    global nlp, embedder, kw_model
    if embedder is None or kw_model is None:
        print("[DEBUG] Lazy loading NLP models into memory...")
        
        from sentence_transformers import SentenceTransformer
        from sklearn.metrics.pairwise import cosine_similarity
        from keybert import KeyBERT
        
        print("[DEBUG] Initializing SentenceTransformer...")
        embedder = SentenceTransformer('all-MiniLM-L6-v2')
        
        print("[DEBUG] Initializing KeyBERT...")
        kw_model = KeyBERT(model=embedder)
        
        print("[DEBUG] All NLP models loaded successfully!")
    
    return None, embedder, kw_model
def calculate_semantic_similarity(resume_text: str, jd_text: str) -> int:
    """Calculates semantic match percentage between Resume and JD."""
    from sklearn.metrics.pairwise import cosine_similarity
    
    _, embedder, _ = get_models()
    # Truncate text to prevent memory issues with massive inputs
    resume_emb = embedder.encode(resume_text[:4000])
    jd_emb = embedder.encode(jd_text[:4000])
    
    sim = cosine_similarity([resume_emb], [jd_emb])[0][0]
    
    # Scale from 0 to 1 and convert to percentage
    score = max(0, min(100, int((sim * 100))))
    return score

def extract_keywords(text: str, top_n: int = 15) -> list[str]:
    """Extracts top keywords using KeyBERT."""
    _, _, kw_model = get_models()
    keywords = kw_model.extract_keywords(text, keyphrase_ngram_range=(1, 2), stop_words='english', top_n=top_n)
    return [kw[0] for kw in keywords]
