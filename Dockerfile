# Root Dockerfile for multi-stage build
FROM node:20 AS backend
WORKDIR /app/backend
COPY backend/package.json ./
RUN npm install
COPY backend/ .

FROM node:20 AS frontend
WORKDIR /app/frontend
COPY frontend/package.json ./
RUN npm install
COPY frontend/ .
RUN npm run build || echo "No build script"

FROM node:20 AS final
WORKDIR /app
COPY --from=backend /app/backend ./backend
COPY --from=frontend /app/frontend ./frontend
EXPOSE 4000
CMD ["node", "backend/index.js"]
