# Versão fixa (LTS): "latest" muda de major sozinha e pode quebrar o bot num rebuild
FROM node:24-slim

WORKDIR /usr/src/app

# Instala só as dependências de produção, exatamente como no package-lock.json
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

USER node

CMD ["node", "bot.js"]
