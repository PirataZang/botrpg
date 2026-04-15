function rollDice(input) {
    const regex = /^(\d*)d(\d+)([+-]\d+)?$/i;
    const match = input.match(regex);

    if (!match) return null;

    let [, diceCount, diceSides, modifier] = match;
    diceCount = diceCount ? parseInt(diceCount) : 1;
    diceSides = parseInt(diceSides);
    modifier = modifier ? parseInt(modifier) : 0;

    if (diceCount > 100)
        return { error: 'Calma lá mestre, máximo 100 dados 😅' };

    const rolls = [];
    let total = 0;

    for (let i = 0; i < diceCount; i++) {
        const roll = Math.floor(Math.random() * diceSides) + 1;
        rolls.push(roll);
        total += roll;
    }

    total += modifier;

    return {
        diceCount,
        diceSides,
        rolls,
        modifier,
        total
    };
}

// 🎲 comando principal
function handle(bot, chatId, args) {
    const input = args[0];
    const mode = args[1]?.toLowerCase(); // adv ou dis

    if (!input) {
        return bot.sendMessage(chatId, '❌ Usa assim: /dices 2d6 ou /dices d20');
    }

    const result = rollDice(input);

    if (!result) {
        return bot.sendMessage(chatId, '❌ Formato inválido. Ex: 2d6, d20, 3d8+2');
    }

    if (result.error) {
        return bot.sendMessage(chatId, `❌ ${result.error}`);
    }

    const { diceCount, diceSides, rolls, modifier } = result;

    let finalTotal = result.total;
    let extraInfo = '';

    // 🎯 vantagem / desvantagem
    if (mode === 'adv' || mode === 'vantagem') {
        const max = Math.max(...rolls);
        finalTotal = max + modifier;
        extraInfo = `\n🏆 *Vantagem:* pegou o maior (${max})`;
    }

    if (mode === 'dis' || mode === 'desvantagem') {
        const min = Math.min(...rolls);
        finalTotal = min + modifier;
        extraInfo = `\n💀 *Desvantagem:* pegou o menor (${min})`;
    }

    const modText = modifier ? ` ${modifier > 0 ? '+' : ''}${modifier}` : '';

    const mensagem = `
🎲 *Rolagem:* ${diceCount}d${diceSides}${modText}

${formatResults(rolls)}
🧮 *Total:* ${finalTotal}
${extraInfo}
    `;

    bot.sendMessage(chatId, mensagem, {
        parse_mode: 'Markdown'
    });
}

// 🧾 formata resultado bonitinho
function formatResults(rolls) {
    let text = '📊 *🎲 Resultados:*\n\n';

    rolls.forEach((roll, index) => {
        text += `Resultado ${index + 1}: ${roll}\n`;
    });

    return text;
}

module.exports = {
    handle,
    rollDice
};