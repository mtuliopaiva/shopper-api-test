# Etapa 1: Build da aplicação
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

# Gerar Prisma Client dentro do ambiente Docker
RUN npx prisma generate

RUN yarn build

# Etapa 2: Imagem de Produção
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json /app/yarn.lock ./

# Copiar o Prisma Client gerado e os binários corretos
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma

RUN yarn install --production

EXPOSE 3000

CMD ["node", "dist/main"]
