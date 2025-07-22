
# Install dependencies only when needed
FROM node:18-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4d670d8f65337416f7b6757456874bb360e190a#nodealpine to understand why we use alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci && npm install @tailwindcss/forms @tailwindcss/typography @tailwindcss/aspect-ratio @tailwindcss/typography @tailwindcss/aspect-ratio

# Rebuild the source code only when needed
FROM node:18-alpine AS builder
WORKDIR /app
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public directory
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
