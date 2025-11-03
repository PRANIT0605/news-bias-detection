import requests
from transformers import pipeline
import torch


NEWSAPI_KEY = '3a2419185af24d5d818e2be37d6de78f'   
NEWSAPI_URL = 'https://newsapi.org/v2/everything'
PAGE_SIZE   = 12


print("Loading bias model ...")
classifier = pipeline(
    "text-classification",
    model="matous-volf/political-leaning-politics",
    tokenizer="launch/POLITICS",
    device=0 if torch.cuda.is_available() else -1
)
print(f"Device: {'GPU' if torch.cuda.is_available() else 'CPU'}")


def fetch_news_articles():

    params = {
        'apiKey': NEWSAPI_KEY,
        'q': 'india',                         # broad keyword
        'language': 'en',
        'pageSize': PAGE_SIZE,
        'domains': 'thehindu.com,timesofindia.indiatimes.com',  # exact domains
        'sortBy': 'publishedAt'
    }

    r = requests.get(NEWSAPI_URL, params=params)
    data = r.json()

    print("\n=== RAW API RESPONSE ===")
    print(f"Status: {data.get('status')}")
    print(f"Total results: {data.get('totalResults')}")
    print(f"Returned articles: {len(data.get('articles', []))}\n")

    if r.status_code != 200 or data.get('status') != 'ok':
        print("API error:", data.get('message', r.text))
        return []

    if not data.get('articles'):
        print("Narrow query gave 0 results → trying a generic fallback...")
        params['q'] = 'news'          # very broad
        params.pop('domains', None)   # remove domain filter
        r = requests.get(NEWSAPI_URL, params=params)
        data = r.json()
        print(f"Fallback totalResults: {data.get('totalResults')}")

    return data.get('articles', [])


def detect_bias(text: str):
    if not text.strip():
        return "neutral", 0.0
    res = classifier(text)[0]
    map_label = {'LABEL_0': 'left', 'LABEL_1': 'center', 'LABEL_2': 'right'}
    return map_label.get(res['label'], 'unknown'), res['score']


def main():
    print("\nFetching articles …")
    articles = fetch_news_articles()
    print(f"Fetched {len(articles)} articles.\n")

    unbiased = []
    for a in articles:
        title = a.get('title', '')
        desc  = a.get('description', '') or ''
        txt   = f"{title}. {desc}"
        src   = a.get('source', {}).get('name', 'Unknown')
        url   = a.get('url', '')

        bias, conf = detect_bias(txt)
        print(f"[{bias.upper():>6}] {title[:65]:65} | {src}")

        if bias == 'center':
            unbiased.append({'title': title, 'source': src, 'url': url, 'conf': conf})

    print("\n=== UNBIASED (CENTER) NEWS ===")
    for u in unbiased:
        print(f"• {u['title']}")
        print(f"  Source: {u['source']} | Confidence: {u['conf']:.2f}")
        print(f"  {u['url']}\n")

if __name__ == '__main__':
    main()