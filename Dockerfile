# =============================================================================
# Multi-stage Dockerfile for Next.js Frontend
# =============================================================================

# Stage 1: Dependencies
FROM node:20.11.0-alpine3.19 AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm via npm (more reliable than corepack)
RUN npm install -g pnpm@9

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# =============================================================================
# Stage 2: Builder - Build the Next.js app
# =============================================================================
FROM node:20.11.0-alpine3.19 AS builder
WORKDIR /app

# Install pnpm via npm (more reliable than corepack)
RUN npm install -g pnpm@9

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application
RUN pnpm build

# =============================================================================
# Stage 3: Runner - Production image
# =============================================================================
FROM node:20.11.0-alpine3.19 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built assets from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]
