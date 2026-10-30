<div align="center">

# ⚔️ 🐉 Lester RPG Bot 🐉 ⚔️

### *Sua taverna de bolso. Dados, monstros, magias e masmorras, direto no Telegram.*

<br>

**📱 Escaneie para entrar na taverna**

<a href="https://t.me/RPGSilverBot">
  <img src="docs/qr-rpgsilverbot.png" alt="QR Code para abrir o @RPGSilverBot no Telegram" width="300">
</a>

<br>

[![Abrir no Telegram](https://img.shields.io/badge/Telegram-@RPGSilverBot-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/RPGSilverBot)

![D&D 5e](https://img.shields.io/badge/D%26D-5e-C62828?style=flat-square&logo=dungeonsanddragons&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-24-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-pronto-2496ED?style=flat-square&logo=docker&logoColor=white)
![Idioma](https://img.shields.io/badge/idioma-PT--BR-F9A825?style=flat-square)

</div>

---

## 📜 O que é?

O **Lester RPG Bot** é o ajudante de mesa que todo Mestre (e todo jogador) queria ter. Em vez de folhear livros no meio da sessão, você pede e ele responde, **em português** e na hora, dentro do próprio Telegram. Sem site, sem app, sem cadastro.

> *"Roll for initiative!"* 🎲

## 🚀 Como começar (30 segundos)

1. **Escaneie o QR Code** lá em cima, ou toque em **[t.me/RPGSilverBot](https://t.me/RPGSilverBot)**.
2. Aperte **Iniciar** (`/start`).
3. Pronto! O menu com botões abre e você já pode jogar. 🍻

> 💡 Também funciona em **grupos**: adicione o bot à mesa do seu grupo e use os comandos com `/comando`.

---

## 🧙 Funcionalidades

| | Comando | O que faz |
|---|---|---|
| 🎲 | `/roll 2d6+3` | Rola qualquer combinação de dados, com **vantagem** e **desvantagem** (`/roll d20 adv`) |
| 👹 | `/monster` · `/monster goblin` | Bestiário com **77 monstros** em PT-BR: ND, defesa, PV, atributos e ataques. Filtre por ND ou tipo |
| 🐾 | `/beast` · `/beast lobo` | **32 feras** e animais para druidas, rangers e encontros na estrada |
| 📜 | `/spell` · `/spell fireball` | Grimório com **319 feitiços** traduzidos, filtrados por classe e nível. Aceita nome em PT ou EN |
| 🎓 | `/class` · `/class mago` | Guia das **12 classes**: dados de vida, proficiências e progressão por nível |
| 🧬 | `/racas` | Guia das **9 raças**, com bônus e ônus de cada uma |
| 🏰 | `/dungeon` | Gera uma **dungeon completa** pelo nível do grupo: ambiente, missão, monstros, baú d12 e obstáculos com CD |
| 🎭 | `/npc` | NPC pronto para a mesa: nome, raça, classe e atributos |
| 👑 | `/loot` | Tesouro para o Mestre: moedas, item comum e item mágico |
| 🎒 | `/item` | Item aleatório para o bolso (ou para a bagunça) do aventureiro |
| ☁️ | `/clima` | Clima sorteado, com efeitos de jogo |
| 🧭 | `/menu` | Menu com botões para tudo isso |

### ✨ Alguns exemplos

```text
/roll 3d8+2          → rola 3d8 e soma 2
/roll d20 adv        → duas rolagens, fica a maior 🏆
/monster goblin      → ficha completa do monstro
/spell bola de fogo  → descrição, alcance, duração e dano
/class paladino      → o guia da classe
```

---

## 🧰 Para o Mestre

- ⚡ **Improviso sem pânico**: jogadores foram para onde você não planejou? `/dungeon`, `/npc` e `/loot` salvam a noite.
- 📏 **Medidas em metros**: alcances e deslocamentos já convertidos.
- 🔘 **Menus com botões**: quase tudo se resolve com toques, sem decorar comando.

---

<details>
<summary><b>🛠️ Quer hospedar o seu próprio bot? (opcional)</b></summary>

<br>

O bot público já está no ar, então **não precisa instalar nada** para jogar. Mas se você quiser rodar uma cópia sua:

1. Crie um bot no [@BotFather](https://t.me/BotFather) e copie o token.
2. Clone e configure:

   ```bash
   git clone https://github.com/PirataZang/botrpg.git
   cd botrpg
   cp .env.example .env      # coloque seu TELEGRAM_TOKEN no .env
   ```

3. Suba com **Docker**:

   ```bash
   docker compose up -d --build
   ```

   ou direto com **Node.js**:

   ```bash
   npm ci --omit=dev
   node bot.js
   ```

> 🔒 Nunca publique seu token. O `.env` já está no `.gitignore`.

</details>

---

<div align="center">

### 🎲 Que os dados estejam sempre a seu favor 🎲

Feito com ☕ e muitos críticos por **[PirataZang](https://github.com/PirataZang)**

*Conteúdo de regras baseado no SRD 5e.*

</div>
