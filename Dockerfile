# ============================================================
# Stage 1: Build Next.js frontend
# ============================================================
FROM node:20-alpine AS frontend-builder

WORKDIR /build/frontend

COPY frontend/package*.json ./
RUN npm ci --legacy-peer-deps

COPY frontend/ ./

# Build args exposed to Next.js at build time
ARG NEXT_PUBLIC_API_URL=/api
ARG NEXT_PUBLIC_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_CLERK_SIGN_IN_URL=/portal/entrar
ARG NEXT_PUBLIC_CLERK_SIGN_UP_URL=/portal/cadastro
ARG NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/portal
ARG NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/portal
ARG NEXT_PUBLIC_CLARITY_ID

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=$NEXT_PUBLIC_CLERK_SIGN_IN_URL
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL=$NEXT_PUBLIC_CLERK_SIGN_UP_URL
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=$NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=$NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
ENV NEXT_PUBLIC_CLARITY_ID=$NEXT_PUBLIC_CLARITY_ID

RUN npm run build

# ============================================================
# Stage 2: Runtime — Node + Nginx + Supervisor
# ============================================================
FROM node:20-alpine AS runtime

# Install nginx and supervisor
RUN apk add --no-cache nginx supervisor dumb-init && \
    mkdir -p /run/nginx /var/log/supervisor

WORKDIR /app

# --- Backend ---
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev && npm cache clean --force

COPY backend/ ./backend/

# --- Frontend (built output) ---
COPY --from=frontend-builder /build/frontend/.next ./frontend/.next
COPY --from=frontend-builder /build/frontend/public ./frontend/public
COPY --from=frontend-builder /build/frontend/package.json ./frontend/package.json
COPY --from=frontend-builder /build/frontend/package-lock.json ./frontend/package-lock.json
COPY --from=frontend-builder /build/frontend/next.config.js ./frontend/next.config.js

RUN cd frontend && npm ci --omit=dev --legacy-peer-deps && npm cache clean --force

# --- Nginx config ---
COPY nginx.conf /etc/nginx/nginx.conf

# --- Supervisor config ---
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD wget -qO- http://localhost/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
