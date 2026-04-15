FROM node:latest

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de dependências (package.json e package-lock.json)
COPY package*.json ./

# Instala as dependências, incluindo a biblioteca do Telegram (node-telegram-bot-api) já no package.json
RUN npm install

# Copia o resto dos arquivos do projeto
COPY . .

# Comando para rodar o bot
CMD ["node", "bot.js"]
