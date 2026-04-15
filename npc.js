const { nameByRace } = require('fantasy-name-generator');

// 🎭 Raças possíveis (pra variar os nomes)
const races = ['human', 'elf', 'dwarf', 'orc', 'halfling'];

// 🧙 Classes clássicas D&D
const classes = [
    'Guerreiro',
    'Mago',
    'Ladino',
    'Clérigo',
    'Bárbaro',
    'Paladino',
    'Bruxo',
    'Feiticeiro',
    'Monge',
    'Druida',
    'Patrulheiro (Ranger)',
    'Bardo'
];

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
    const name = nameByRace(race);

    return `
🎭 *NPC Gerado*

👤 Nome: ${name}
🧬 Raça: ${race}
🧙 Classe: ${random(classes)}

📊 *Atributos*
FOR: ${str = rollStat()} ( ${getModifier(str)} )
DES: ${dex = rollStat()} ( ${getModifier(dex)} )
CON: ${con = rollStat()} ( ${getModifier(con)} )
INT: ${int = rollStat()} ( ${getModifier(int)} )
SAB: ${sab = rollStat()} ( ${getModifier(sab)} )
CAR: ${car = rollStat()} ( ${getModifier(car)} )
    `;
}

module.exports = {
    generateNPC
};