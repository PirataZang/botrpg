const monsters = require('./data/Monsters.json');

/**
 * Normaliza strings para busca sem acentos e minúscula.
 */
function normalizeStr(str) {
    if (!str) return '';
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Avalia o valor numérico de um ND (incluindo frações).
 */
function evalND(nd) {
    if (!nd) return 0;
    if (typeof nd === 'number') return nd;
    if (nd.includes('/')) {
        const [num, den] = nd.split('/').map(Number);
        return num / den;
    }
    return Number(nd);
}

/**
 * Emojis por monstro (busca por palavra-chave no nome).
 * A ordem importa: chaves mais específicas primeiro.
 */
const monsterEmojis = [
    { keys: ['hobgoblin'], emoji: '⚔️' },
    { keys: ['goblin'], emoji: '🗡️' },
    { keys: ['esqueleto'], emoji: '💀' },
    { keys: ['labareda', 'flameskull'], emoji: '☠️' },
    { keys: ['zumbi'], emoji: '🧟' },
    { keys: ['carnical', 'ghoul', 'ghast'], emoji: '🦴' },
    { keys: ['kobold'], emoji: '🐲' },
    { keys: ['cultista'], emoji: '🕯️' },
    { keys: ['gnoll'], emoji: '🐕' },
    { keys: ['orc'], emoji: '🪓' },
    { keys: ['espreitador', 'mastiff'], emoji: '🐺' },
    { keys: ['sombra'], emoji: '🌑' },
    { keys: ['bugbear'], emoji: '🐻' },
    { keys: ['espantalho'], emoji: '🎃' },
    { keys: ['harpia', 'harpy'], emoji: '🦅' },
    { keys: ['grimlock'], emoji: '🙈' },
    { keys: ['troglodita'], emoji: '🦎' },
    { keys: ['dretch'], emoji: '😈' },
    { keys: ['diabrete', 'imp'], emoji: '👿' },
    { keys: ['quasit'], emoji: '👺' },
    { keys: ['cao infernal', 'hell hound'], emoji: '🔥' },
    { keys: ['mephit do fogo', 'magma mephit'], emoji: '🔥' },
    { keys: ['mephit'], emoji: '💨' },
    { keys: ['kuo-toa'], emoji: '🐟' },
    { keys: ['sahuagin'], emoji: '🦈' },
    { keys: ['fungoide', 'esporo', 'fungus', 'spore'], emoji: '🍄' },
    { keys: ['armadura animada', 'animated armor'], emoji: '🛡️' },
    { keys: ['espada voadora', 'flying sword'], emoji: '⚔️' },
    { keys: ['homunculo'], emoji: '🧪' },
    { keys: ['fervoroso', 'firenewt'], emoji: '🦎' },
    { keys: ['magma', 'magmin'], emoji: '🌋' },
    { keys: ['gelatina', 'cube'], emoji: '🧊' },
    { keys: ['geleia', 'ooze'], emoji: '🍮' },
    { keys: ['scion', 'choker'], emoji: '🖐️' },
    { keys: ['mimico', 'mimic'], emoji: '📦' },
    { keys: ['ogre', 'ogrillon'], emoji: '👹' },
    { keys: ['gargula', 'gargoyle'], emoji: '🗿' },
    { keys: ['notico', 'nothic'], emoji: '👁️' },
    { keys: ['aniquilador', 'rust'], emoji: '🪲' },
    { keys: ['pegaso', 'peryton'], emoji: '🦌' },
    { keys: ['fatuo', 'wisp'], emoji: '✨' },
    { keys: ['anao de gelo', 'azer'], emoji: '❄️' },
    { keys: ['anis', 'hag'], emoji: '🧙‍♀️' },
    { keys: ['tumba', 'poltergeist'], emoji: '👻' },
    { keys: ['lobisomem', 'werewolf'], emoji: '🐺' },
    { keys: ['mumia', 'mummy'], emoji: '⚰️' },
    { keys: ['mantipora', 'manticore'], emoji: '🦁' },
    { keys: ['minotauro', 'minotaur'], emoji: '🐂' },
    { keys: ['doppelganger'], emoji: '🪞' },
    { keys: ['anconideo', 'hook'], emoji: '🪝' },
    { keys: ['cavaleiro', 'knight'], emoji: '🛡️' },
    { keys: ['veterano', 'veteran'], emoji: '🎖️' },
    { keys: ['gladiador', 'gladiator'], emoji: '🤺' },
    { keys: ['espectro da noite', 'wraith'], emoji: '🌫️' },
    { keys: ['espectro', 'specter'], emoji: '🫥' },
    { keys: ['fantasma', 'ghost'], emoji: '👻' },
    { keys: ['banshee'], emoji: '😱' },
    { keys: ['ettin'], emoji: '👥' },
    { keys: ['sucubo', 'incubo', 'succubus', 'incubus'], emoji: '💋' },
    { keys: ['elmo', 'helmed'], emoji: '🪖' },
    { keys: ['yuan-ti'], emoji: '🐍' },
    { keys: ['lamia'], emoji: '🧜‍♀️' },
    { keys: ['gorgone', 'chuul'], emoji: '🦞' },
    { keys: ['barghest'], emoji: '🐺' },
    { keys: ['monticulo', 'shambling'], emoji: '🌿' },
    { keys: ['golem'], emoji: '🗿' },
    { keys: ['vrock'], emoji: '🦅' },
    { keys: ['barbezu', 'bearded devil'], emoji: '😈' },
    { keys: ['slaad'], emoji: '🐸' },
    { keys: ['troll'], emoji: '🧌' },
    { keys: ['unicornio', 'unicorn'], emoji: '🦄' },
    { keys: ['vampir'], emoji: '🧛' }
];

/**
 * Retorna o emoji que representa o monstro.
 */
function getMonsterEmoji(name) {
    const n = normalizeStr(name);
    const found = monsterEmojis.find(e => e.keys.some(k => n.includes(k)));
    return found ? found.emoji : '👹';
}

/**
 * Busca monstro por nome (suporta busca parcial)
 */
function getMonster(name) {
    const search = normalizeStr(name);
    return monsters.find(m => normalizeStr(m.nome).includes(search));
}

/**
 * Busca monstro pelo índice no JSON
 */
function getMonsterByIndex(index) {
    return monsters[index] || null;
}

/**
 * Formata a ficha do monstro com Link e Modificadores
 */
function formatMonster(monster) {
    const attacksFormatted = monster.lista_ataques && monster.lista_ataques.length > 0
        ? monster.lista_ataques.map(atk => `• *${atk.nome}*: Dano ${atk.dano} (média ${atk.media})`).join('\n')
        : "Nenhum ataque listado";

    return `
📖 *FICHA DE MONSTRO*
━━━━━━━━━━━━━━━━━━━━
${getMonsterEmoji(monster.nome)} *${monster.nome.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━━
⭐ *ND:* ${monster.nd} | 🧬 *Tipo:* ${monster.tipo}
⚔️ *Qtd. Ataques:* ${monster.ataques}

🛡️ *DEFESA*
• *CA:* ${monster.defesa}
• *HP:* ${monster.hp}

📊 *ATRIBUTOS (MOD)*
💪 \`FOR: ${monster.atributos.for}\`
🎯 \`DES: ${monster.atributos.des}\`
🛡️ \`CON: ${monster.atributos.con}\`
🧠 \`INT: ${monster.atributos.int}\`
👁️ \`SAB: ${monster.atributos.sab}\`
🗣️ \`CAR: ${monster.atributos.car}\`

⚔️ *ATAQUES*
${attacksFormatted}

━━━━━━━━━━━━━━━━━━━━
🔗 [Acesse a ficha no D&D Beyond](${monster.link})
━━━━━━━━━━━━━━━━━━━━
_Dica: Use /monster <nome> para buscar detalhes._`;
}

/**
 * Botões iniciais de filtro para Monstros
 */
function getFilterButtons() {
    return {
        inline_keyboard: [
            [
                { text: "⭐ Filtrar por ND (CR)", callback_data: "m_filter_cr_menu" },
                { text: "🧬 Filtrar por Tipo", callback_data: "m_filter_type_menu" }
            ]
        ]
    };
}

/**
 * Menu dinâmico de NDs (CR)
 */
function getCRMenu() {
    const nds = [...new Set(monsters.map(m => m.nd))].sort((a, b) => {
        return evalND(a) - evalND(b);
    });

    const buttons = [];
    for (let i = 0; i < nds.length; i += 3) {
        const row = nds.slice(i, i + 3).map(nd => ({
            text: `ND ${nd}`,
            callback_data: `m_list_cr_${nd}`
        }));
        buttons.push(row);
    }
    buttons.push([{ text: "⬅️ Voltar", callback_data: "m_filter_main" }]);
    return { inline_keyboard: buttons };
}

/**
 * Menu dinâmico de Tipos
 */
function getTypeMenu() {
    const types = [...new Set(monsters.map(m => m.tipo))].sort();
    const buttons = [];
    for (let i = 0; i < types.length; i += 2) {
        const row = types.slice(i, i + 2).map(type => ({
            text: type.charAt(0).toUpperCase() + type.slice(1),
            callback_data: `m_list_type_${type}`
        }));
        buttons.push(row);
    }
    buttons.push([{ text: "⬅️ Voltar", callback_data: "m_filter_main" }]);
    return { inline_keyboard: buttons };
}

/**
 * Normaliza e extrai critério, valor e número da página de uma string de callback.
 */
function parseCallback(data) {
    const parts = data.split('_');
    let page = 1;
    let valueParts = parts.slice(3);
    
    if (valueParts.length > 0) {
        const lastPart = valueParts[valueParts.length - 1];
        if (/^p\d+$/.test(lastPart)) {
            page = parseInt(lastPart.substring(1), 10);
            valueParts = valueParts.slice(0, -1);
        }
    }
    
    const criteria = parts[2];
    const value = valueParts.join('_');
    
    return { criteria, value, page };
}

/**
 * Extrai índice do monstro e contexto da lista de um callback m_show_.
 * Formato: m_show_<index>_<criteria>_<value>_p<page>
 */
function parseShowCallback(data) {
    const parts = data.split('_');
    const index = parseInt(parts[2], 10);
    const criteria = parts[3];
    let page = 1;
    let valueParts = parts.slice(4);

    if (valueParts.length > 0) {
        const lastPart = valueParts[valueParts.length - 1];
        if (/^p\d+$/.test(lastPart)) {
            page = parseInt(lastPart.substring(1), 10);
            valueParts = valueParts.slice(0, -1);
        }
    }

    return { index, criteria, value: valueParts.join('_'), page };
}

/**
 * Botão para voltar da ficha do monstro para a lista filtrada.
 */
function getBackToListButton(criteria, value, page) {
    return {
        inline_keyboard: [[{
            text: "⬅️ Voltar à lista",
            callback_data: `m_list_${criteria}_${value}_p${page}`
        }]]
    };
}

/**
 * Lista monstros filtrados como botões com paginação de 10 em 10 itens.
 */
function listByFilter(criteria, value, page = 1) {
    const filtered = monsters
        .map((monster, index) => ({ monster, index }))
        .filter(({ monster: m }) => {
            if (criteria === 'cr' || criteria === 'nd') return m.nd.toString() === value.toString();
            if (criteria === 'type' || criteria === 'tipo') return m.tipo === value;
            return false;
        });

    if (filtered.length === 0) {
        return {
            text: "Nenhum monstro encontrado.",
            markup: { inline_keyboard: [[{ text: "⬅️ Voltar", callback_data: "m_filter_main" }]] }
        };
    }

    const itemsPerPage = 10;
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const currentPage = Math.max(1, Math.min(page, totalPages));
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = filtered.slice(startIndex, endIndex);
    
    const infoText = `🔎 *Monstros (${value}):*\n_Página ${currentPage} de ${totalPages} (Total: ${filtered.length})_\n\nToque em um monstro para ver a ficha:`;

    // Botões dos monstros (1 por linha), ex: "🦴 Carniçal (Ghoul)"
    const monsterButtons = paginatedItems.map(({ monster: m, index }) => ([{
        text: `${getMonsterEmoji(m.nome)} ${m.nome}`,
        callback_data: `m_show_${index}_${criteria}_${value}_p${currentPage}`
    }]));

    // Botões de navegação destacados com indicador de página
    const navButtons = [];
    if (totalPages > 1) {
        if (currentPage > 1) {
            navButtons.push({
                text: "⏪ ANTERIOR",
                callback_data: `m_list_${criteria}_${value}_p${currentPage - 1}`
            });
        }
        navButtons.push({
            text: `📄 ${currentPage}/${totalPages}`,
            callback_data: "noop"
        });
        if (currentPage < totalPages) {
            navButtons.push({
                text: "PRÓXIMA ⏩",
                callback_data: `m_list_${criteria}_${value}_p${currentPage + 1}`
            });
        }
    }

    const inline_keyboard = [...monsterButtons];
    if (navButtons.length > 0) {
        inline_keyboard.push(navButtons);
    }
    inline_keyboard.push([{ text: "🔙 Voltar aos Filtros", callback_data: "m_filter_main" }]);

    return {
        text: infoText,
        markup: { inline_keyboard }
    };
}

module.exports = {
    getMonster,
    getMonsterByIndex,
    formatMonster,
    getFilterButtons,
    getCRMenu,
    getTypeMenu,
    parseCallback,
    parseShowCallback,
    getBackToListButton,
    listByFilter
};