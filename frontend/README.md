# AI Knowledgebase Frontend

## Setup

1. Copy `.env.local`:

`NEXT_PUBLIC_API_URL=http://localhost:8000`

2. Install dependencies:
   `npm install`

3. Start development:
   `npm run dev`

4. Run tests:
   `npm test`

## Build & Export

```
npm run build
npm run start
```

## Docker

```
docker build -t kb-frontend .
docker run -p 3000:3000 kb-frontend
```
