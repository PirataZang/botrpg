const TelegramBot = require('node-telegram-bot-api');

// imports
const dice = require('./dices');
const itens = require('./itens');
const monsters = require('./monsters');
const beasts = require('./beast');
const npc = require('./npc');
const weather = require('./weather');
const loot = require('./loot');

// DICA: Mantenha o TOKEN no .env por segurança, mas para teste deixamos aqui
const TOKEN = "8689733515:AAG5REtRFUxysZHLcrCKntIxdslIZ9f7HQM";
const bot = new TelegramBot(TOKEN, { polling: true });

console.log('🤖 Bot rodando...');

// 🎲 DADOS
bot.onText(/\/roll (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const args = match[1].split(' ');
    dice.handle(bot, chatId, args);
});

// 🎒 ITEM ALEATÓRIO
bot.onText(/\/item/, (msg) => {
    const chatId = msg.chat.id;
    const item = itens.getRandomItem();
    bot.sendMessage(chatId, `🎒 Item encontrado:\n\n*${item.nome}*\n${item.descricao}`, { parse_mode: 'Markdown' });
});

// 👹 MONSTRO (Ajustado para aceitar filtros)
bot.onText(/\/monster(.*)/, (msg, match) => {
    const chatId = msg.chat.id;
    const input = match[1].trim();

    if (!input) {
        return bot.sendMessage(chatId, "👹 *Bestiário de Monstros*: Escolha um filtro ou digite o nome.", {
            parse_mode: 'Markdown',
            reply_markup: monsters.getFilterButtons()
        });
    }

    const monster = monsters.getMonster(input);
    if (!monster) return bot.sendMessage(chatId, '❌ Monstro não encontrado');

    bot.sendMessage(chatId, monsters.formatMonster(monster), { parse_mode: 'Markdown' });
});

// 🐻 BESTAS
bot.onText(/\/beast(.*)/, (msg, match) => {
    const chatId = msg.chat.id;
    const input = match[1].trim();

    if (!input) {
        return bot.sendMessage(chatId, "📖 *Bestiário de Feras*: Escolha um filtro ou digite o nome.", {
            parse_mode: 'Markdown',
            reply_markup: beasts.getFilterButtons()
        });
    }

    const beast = beasts.getBeast(input);
    if (!beast) return bot.sendMessage(chatId, '❌ Fera não encontrada');

    bot.sendMessage(chatId, beasts.formatBeast(beast), { parse_mode: 'Markdown' });
});

// 🎭 NPC
bot.onText(/\/npc/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, npc.generateNPC(), { parse_mode: 'Markdown' });
});

// ☁️ CLIMA
bot.onText(/\/clima/, (msg) => {
    const chatId = msg.chat.id;
    const clima = weather.getRandomWeather();
    bot.sendMessage(chatId, `☁️ *Clima Sorteado:*\n\n*${clima.nome}*\n${clima.descricao}`, { parse_mode: 'Markdown' });
});

// 👑 LOOT DO MESTRE
bot.onText(/\/loot/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, loot.generateLoot(), { parse_mode: 'Markdown' });
});

// 📚 HELP
bot.onText(/\/help/, (msg) => {
    sendMenu(msg.chat.id);
});

const helpText = `
✨ *GUIA DE COMANDOS - BOT RPG* ✨
━━━━━━━━━━━━━━━━━━━━

🎲 *SISTEMA DE DADOS*
• \`/roll 1d20\` - Rola um dado.

🐾 *BESTIÁRIO (ANIMAIS)*
• \`/beast\` - Abre o menu de filtros.
• \`/beast <nome>\` - Busca animal específico.

👹 *MONSTROS*
• \`/monster\` - Abre menu de filtros.
• \`/monster <nome>\` - Busca monstro específico.

🎒 *UTILITÁRIOS*
• \`/item\` - Item aleatório.
• \`/npc\` - Gera um NPC completo.
• \`/clima\` - Gera um clima aleatório.
• \`/loot\` - Gera opções de loot para o mestre.

━━━━━━━━━━━━━━━━━━━━
_Dica: Comandos sem nome abrem filtros!_`;

const menuMarkup = {
    inline_keyboard: [
        [{ text: "🎲 Rolar Dado", callback_data: "cmd_roll" }, { text: "🎒 Item Aleatório", callback_data: "cmd_item" }],
        [{ text: "👹 Monstros", callback_data: "cmd_monster" }, { text: "🐾 Feras", callback_data: "cmd_beast" }],
        [{ text: "🎭 Gerar NPC", callback_data: "cmd_npc" }, { text: "☁️ Clima", callback_data: "cmd_weather" }],
        [{ text: "👑 Loot do Mestre", callback_data: "cmd_loot" }]
    ]
};

function sendMenu(chatId) {
    bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown', reply_markup: menuMarkup });
}

// Captura qualquer mensagem que não seja comando
bot.on('message', (msg) => {
    if (msg.text && !msg.text.startsWith('/')) {
        sendMenu(msg.chat.id);
    }
});

// 🔘 CALLBACK QUERY (Tratamento de botões)
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const data = query.data;

    let text = "Escolha uma opção:";
    let markup = {};

    // --- Lógica do Menu Principal ---
    if (data === "cmd_menu") {
        text = helpText;
        markup = menuMarkup;
    } else if (data === "cmd_roll") {
        text = "🎲 *Como rolar dados:*\n\nDigite `/roll` seguido da quantidade e tipo de dado.\nExemplo: `/roll 1d20` ou `/roll 2d6`";
        markup = { inline_keyboard: [[{ text: "⬅️ Voltar ao Menu", callback_data: "cmd_menu" }]] };
    } else if (data === "cmd_item") {
        const item = itens.getRandomItem();
        text = `🎒 Item encontrado:\n\n*${item.nome}*\n${item.descricao}`;
        markup = { inline_keyboard: [[{ text: "⬅️ Voltar ao Menu", callback_data: "cmd_menu" }]] };
    } else if (data === "cmd_npc") {
        text = npc.generateNPC();
        markup = { inline_keyboard: [[{ text: "⬅️ Voltar ao Menu", callback_data: "cmd_menu" }]] };
    } else if (data === "cmd_weather") {
        const clima = weather.getRandomWeather();
        text = `☁️ *Clima Sorteado:*\n\n*${clima.nome}*\n${clima.descricao}`;
        markup = { inline_keyboard: [[{ text: "⬅️ Voltar ao Menu", callback_data: "cmd_menu" }]] };
    } else if (data === "cmd_loot") {
        text = loot.generateLoot();
        markup = { inline_keyboard: [[{ text: "⬅️ Voltar ao Menu", callback_data: "cmd_menu" }]] };
    } else if (data === "cmd_monster") {
        text = "👹 *Bestiário de Monstros*: Escolha um filtro ou digite o nome.";
        markup = { inline_keyboard: [...monsters.getFilterButtons().inline_keyboard, [{ text: "🏠 Menu Principal", callback_data: "cmd_menu" }]] };
    } else if (data === "cmd_beast") {
        text = "📖 *Bestiário de Feras*: Escolha um filtro ou digite o nome.";
        markup = { inline_keyboard: [...beasts.getFilterButtons().inline_keyboard, [{ text: "🏠 Menu Principal", callback_data: "cmd_menu" }]] };
    }
    // --- Lógica de Monstros (Prefix m_) ---
    else if (data === "m_filter_main") {
        markup = { inline_keyboard: [...monsters.getFilterButtons().inline_keyboard, [{ text: "🏠 Menu Principal", callback_data: "cmd_menu" }]] };
    } else if (data === "m_filter_cr_menu") {
        text = "Selecione o ND (Challenge Rating):";
        markup = monsters.getCRMenu();
    } else if (data === "m_filter_type_menu") {
        text = "Selecione o tipo de monstro:";
        markup = monsters.getTypeMenu();
    } else if (data.startsWith("m_list_")) {
        const parts = data.split('_');
        text = monsters.listByFilter(parts[2], parts[3]);
        markup = { inline_keyboard: [[{ text: "⬅️ Voltar", callback_data: "m_filter_main" }]] };
    }

    // --- Lógica de Feras (Beasts) ---
    else if (data === "filter_main") {
        markup = { inline_keyboard: [...beasts.getFilterButtons().inline_keyboard, [{ text: "🏠 Menu Principal", callback_data: "cmd_menu" }]] };
    } else if (data === "filter_nd_menu") {
        text = "Selecione o Nível de Desafio (ND):";
        markup = beasts.getNDMenu();
    } else if (data === "filter_tipo_menu") {
        text = "Selecione o tipo de criatura:";
        markup = beasts.getTipoMenu();
    } else if (data.startsWith("list_")) {
        const parts = data.split('_');
        text = beasts.listByFilter(parts[1], parts[2]);
        markup = { inline_keyboard: [[{ text: "⬅️ Voltar", callback_data: "filter_main" }]] };
    }

    // Edita a mensagem para evitar spam
    bot.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: markup,
        disable_web_page_preview: true
    }).catch(err => console.log("Erro ao editar: ", err.message));
});