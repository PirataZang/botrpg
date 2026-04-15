const TelegramBot = require('node-telegram-bot-api');

// imports
const dice = require('./dices');
const itens = require('./itens');
const monsters = require('./monsters');
const beasts = require('./beast');
const npc = require('./npc');

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

// 📚 HELP
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
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

━━━━━━━━━━━━━━━━━━━━
_Dica: Comandos sem nome abrem filtros!_`;

    bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
});

// 🔘 CALLBACK QUERY (Tratamento de botões)
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const data = query.data;

    let text = "Escolha uma opção:";
    let markup = {};

    // --- Lógica de Monstros (Prefix m_) ---
    if (data === "m_filter_main") {
        markup = monsters.getFilterButtons();
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
        markup = beasts.getFilterButtons();
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