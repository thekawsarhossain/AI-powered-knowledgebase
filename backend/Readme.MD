# AI Knowledgebase Backend

## Setup

1. Copy `.env.example` to `.env` and fill values:

```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/knowledgebase
SHADOW_DATABASE_URL=postgresql://user:pass@localhost:5432/knowledgebase_shadow
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
PORT=8000
CORS_ORIGIN=http://localhost:3000
```

2. Install dependencies:
   `npm install`

3. Generate Prisma client & run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Start development server:

`npm run dev`

## Scripts

- `npm run dev` – development
- `npm run build` – compile
- `npm start` – start production
- `npm test` – run tests

## Docker

1. Build & run:
   `docker-compose up --build`

2. Services:

- `postgres:5432`
- `api:8000`

[Postman Collection](https://documenter.getpostman.com/view/21128063/2sB34miHwm)
