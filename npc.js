const fs = require('fs');
const path = require('path');

const namesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'npc_names.json'), 'utf8'));

// 🎭 Raças possíveis
const races = ['Humano', 'Elfo', 'Anão', 'Orc', 'Halfling', 'Draconato', 'Gnomo', 'Tiefling', 'Meio-Elfo'];

// 🧙 Classes e suas prioridades de atributos (do maior para o menor)
const classesData = {
    'Bárbaro': ['FOR', 'CON', 'DES', 'SAB', 'INT', 'CAR'],
    'Bardo': ['CAR', 'DES', 'CON', 'INT', 'SAB', 'FOR'],
    'Bruxo': ['CAR', 'CON', 'DES', 'INT', 'SAB', 'FOR'],
    'Clérigo': ['SAB', 'CON', 'FOR', 'CAR', 'INT', 'DES'],
    'Druida': ['SAB', 'CON', 'DES', 'INT', 'CAR', 'FOR'],
    'Feiticeiro': ['CAR', 'CON', 'DES', 'INT', 'SAB', 'FOR'],
    'Guerreiro': ['FOR', 'CON', 'DES', 'SAB', 'INT', 'CAR'], 
    'Ladino': ['DES', 'INT', 'CON', 'CAR', 'SAB', 'FOR'],
    'Mago': ['INT', 'CON', 'DES', 'SAB', 'CAR', 'FOR'],
    'Monge': ['DES', 'SAB', 'CON', 'FOR', 'INT', 'CAR'],
    'Paladino': ['FOR', 'CAR', 'CON', 'SAB', 'INT', 'DES'],
    'Patrulheiro (Ranger)': ['DES', 'SAB', 'CON', 'INT', 'FOR', 'CAR']
};

const classNames = Object.keys(classesData);

// 🎲 rolagem mais "RPG raiz" (3d6)
function rollStat() {
    let total = 0;
    for (let i = 0; i < 3; i++) {
        total += Math.floor(Math.random() * 6) + 1;
    }
    return total;
}

function getModifier(stat) {
    return Math.floor((stat - 10) / 2);
}

function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateNPC() {
    const race = random(races);
    const firstName = random(namesData.nomes);
    const lastName = random(namesData.sobrenomes);
    const name = `${firstName} ${lastName}`;

    let className = random(classNames);
    let priority = [...classesData[className]];

    // Para Guerreiro, decide aleatoriamente se foca em Força ou Destreza
    if (className === 'Guerreiro' && Math.random() > 0.5) {
        priority = ['DES', 'CON', 'FOR', 'SAB', 'INT', 'CAR'];
    }

    // Rola 6 atributos e ordena do maior para o menor
    let rolls = [];
    for (let i = 0; i < 6; i++) {
        rolls.push(rollStat());
    }
    rolls.sort((a, b) => b - a); // Ordem decrescente

    // Distribui os valores de acordo com a prioridade da classe
    let stats = {};
    for (let i = 0; i < 6; i++) {
        stats[priority[i]] = rolls[i];
    }

    return `
🎭 *NPC Gerado*

👤 Nome: ${name}
🧬 Raça: ${race}
🧙 Classe: ${className}

📊 *Atributos Otimizados*
FOR: ${stats['FOR']} ( ${getModifier(stats['FOR']) > 0 ? '+' : ''}${getModifier(stats['FOR'])} )
DES: ${stats['DES']} ( ${getModifier(stats['DES']) > 0 ? '+' : ''}${getModifier(stats['DES'])} )
CON: ${stats['CON']} ( ${getModifier(stats['CON']) > 0 ? '+' : ''}${getModifier(stats['CON'])} )
INT: ${stats['INT']} ( ${getModifier(stats['INT']) > 0 ? '+' : ''}${getModifier(stats['INT'])} )
SAB: ${stats['SAB']} ( ${getModifier(stats['SAB']) > 0 ? '+' : ''}${getModifier(stats['SAB'])} )
CAR: ${stats['CAR']} ( ${getModifier(stats['CAR']) > 0 ? '+' : ''}${getModifier(stats['CAR'])} )
    `;
}

module.exports = {
    generateNPC
};