const itens = require('./data/itens.json');

function getRandomItem() {
    const randomIndex = Math.floor(Math.random() * itens.length);
    return itens[randomIndex];
}

module.exports = {
    getRandomItem
};