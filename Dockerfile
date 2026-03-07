FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.30.3 --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/core/package.json ./packages/core/
COPY packages/api/package.json ./packages/api/
COPY packages/web/package.json ./packages/web/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/core/node_modules ./packages/core/node_modules
COPY --from=deps /app/packages/api/node_modules ./packages/api/node_modules
COPY --from=deps /app/packages/web/node_modules ./packages/web/node_modules
COPY . .
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/packages/api/dist ./packages/api/dist
COPY --from=builder /app/packages/api/package.json ./packages/api/
COPY --from=builder /app/packages/core/dist ./packages/core/dist
COPY --from=builder /app/packages/core/package.json ./packages/core/
COPY --from=builder /app/packages/web/.next ./packages/web/.next
COPY --from=builder /app/packages/web/public ./packages/web/public
COPY --from=builder /app/packages/web/package.json ./packages/web/
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3654 3456
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
	CMD wget --no-verbose --tries=1 --spider http://localhost:3654/health || exit 1
USER node
CMD ["node", "packages/api/dist/index.js"]
