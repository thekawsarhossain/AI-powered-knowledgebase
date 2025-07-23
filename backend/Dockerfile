FROM node:18-alpine

WORKDIR /app

RUN npm install -g typescript

COPY package*.json ./
RUN npm ci --only=production


COPY prisma ./prisma/

RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/api/health', (res) => { \
    if (res.statusCode === 200) process.exit(0); else process.exit(1); \
  }).on('error', () => process.exit(1));"

# CMD ["npm", "start"]
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
