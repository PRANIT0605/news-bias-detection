# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
from bs4 import BeautifulSoup
from transformers import pipeline
import torch
import re

app = FastAPI(title="Unbiased News Engine")

# CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load bias model once
print("Loading political bias model...")
classifier = pipeline(
    "text-classification",
    model="matous-volf/political-leaning-politics",
    tokenizer="launch/POLITICS",
    device=0 if torch.cuda.is_available() else -1
)

NEWSAPI_KEY = '3a2419185af24d5d818e2be37d6de78f'
NEWSAPI_URL = 'https://newsapi.org/v2/everything'

# Bias keyword patterns (Phase 3)
BIAS_PATTERNS = {
    "Sensationalism": ["shocking", "crisis", "urgent", "breaking", "disaster", "catastrophe", "explosive", "alarming"],
    "Omission Bias": ["but", "however", "although", "despite", "ignored", "omitted", "not mentioned"],
    "Bias by Labeling": ["radical", "extreme", "fanatic", "corrupt", "evil", "terrorist", "criminal"],
    "Opinion as Fact": ["clearly", "obviously", "everyone knows", "undeniable", "plainly", "certainly"],
    "Slant Bias": ["best", "worst", "failed", "success", "victory", "defeat", "triumph", "collapse"],
    "Subjective Adjectives": ["beautiful", "horrible", "amazing", "disgusting", "pathetic", "brilliant"],
    "Emotionalism": ["heartbreaking", "outrage", "fury", "tears", "devastated", "joy", "celebration"]
}

def fetch_articles():
    params = {
        'apiKey': NEWSAPI_KEY,
        'q': 'india OR world OR politics',
        'language': 'en',
        'pageSize': 20,
        'domains': 'thehindu.com,timesofindia.indiatimes.com,bbc.com,reuters.com,apnews.com',
        'sortBy': 'publishedAt'
    }
    try:
        r = requests.get(NEWSAPI_URL, params=params, timeout=10)
        return r.json().get('articles', [])
    except:
        return []

def detect_political_bias(text):
    if not text or len(text) < 20:
        return "neutral", 0.0
    try:
        res = classifier(text[:512])[0]  # Truncate for speed
        map_label = {'LABEL_0': 'left', 'LABEL_1': 'center', 'LABEL_2': 'right'}
        return map_label.get(res['label'], 'neutral'), res['score']
    except:
        return "neutral", 0.0

def fetch_full_text(url):
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        r = requests.get(url, headers=headers, timeout=15)
        soup = BeautifulSoup(r.content, 'html.parser')
        
        # Remove unwanted elements
        for elem in soup(["script", "style", "nav", "header", "footer", "aside", "iframe"]):
            elem.decompose()
        
        paragraphs = soup.find_all('p')
        text = ' '.join([p.get_text(strip=True) for p in paragraphs if len(p.get_text()) > 20])
        return text[:6000]  # Limit for performance
    except Exception as e:
        return f"Could not fetch article: {str(e)}"

def detect_top_biases(text):
    if not text or len(text) < 50:
        return []
    
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if len(s) > 20]
    
    bias_scores = []
    
    for bias_type, keywords in BIAS_PATTERNS.items():
        matches = []
        score = 0
        for sent in sentences:
            count = sum(1 for kw in keywords if kw.lower() in sent.lower())
            if count > 0:
                matches.append(sent)
                score += count
        if score > 0:
            example = max(matches, key=len)[:200]
            bias_scores.append({
                "type": bias_type,
                "score": score / len(sentences),
                "example": example + "..." if len(example) > 197 else example
            })
    
    # Sort by score
    return sorted(bias_scores, key=lambda x: x["score"], reverse=True)[:3]

@app.get("/unbiased-news")
def get_unbiased_news():
    articles = fetch_articles()
    unbiased = []

    for a in articles:
        title = a.get('title', '')
        desc = a.get('description', '') or ''
        text = f"{title}. {desc}"
        src = a.get('source', {}).get('name', 'Unknown')
        url = a.get('url', '')

        bias, conf = detect_political_bias(text)
        if bias == 'center' and conf > 0.35:
            unbiased.append({
                "title": title,
                "source": src,
                "url": url,
                "confidence": round(conf, 3),
                "publishedAt": a.get('publishedAt', '')
            })

    return {"articles": unbiased[:10]}

@app.get("/article-detail")
def get_article_detail(url: str):
    text = fetch_full_text(url)
    biases = detect_top_biases(text)
    return {
        "text": text,
        "biases": biases,
        "highlighted": highlight_sentences(text, biases)
    }

def highlight_sentences(text, biases):
    highlighted = text
    for b in biases:
        example = b['example'].replace('...', '')
        if example in highlighted:
            regex = re.escape(example)
            highlighted = re.sub(f"({regex})", r'<mark class="bias-highlight">\1</mark>', highlighted, count=1)
    return highlighted