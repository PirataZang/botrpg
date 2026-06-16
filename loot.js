const fs = require('fs');
const path = require('path');

const lootData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'loot.json'), 'utf8'));

function generateLoot() {
    const moneyType = lootData.money[Math.floor(Math.random() * lootData.money.length)];
    const moneyAmount = Math.floor(Math.random() * 10) + 1; // 1 a 10
    const moneyText = `${moneyAmount} Moeda(s) de ${moneyType}`;

    const commonItem = lootData.comuns[Math.floor(Math.random() * lootData.comuns.length)];
    const magicItem = lootData.magicos[Math.floor(Math.random() * lootData.magicos.length)];

    return `🎒 *GERADOR DE LOOT DO MESTRE* 🎒
━━━━━━━━━━━━━━━━━━━━

💰 *Dinheiro:* ${moneyText}

📦 *Item Comum:*
*${commonItem.nome}*
_${commonItem.descricao}_

✨ *Item Mágico:*
*${magicItem.nome}*
_${magicItem.descricao}_

━━━━━━━━━━━━━━━━━━━━
_Dica: Mestre, escolha o loot que melhor se encaixa no momento do jogo!_`;
}

module.exports = {
    generateLoot
};
