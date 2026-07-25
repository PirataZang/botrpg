const beasts = require('./data/Beasts.json');

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
 * Emojis por criatura (busca por palavra-chave no nome).
 * A ordem importa: chaves mais específicas primeiro.
 */
const beastEmojis = [
    { keys: ['urso polar'], emoji: '🐻‍❄️' },
    { keys: ['urso'], emoji: '🐻' },
    { keys: ['lobo'], emoji: '🐺' },
    { keys: ['pantera'], emoji: '🐆' },
    { keys: ['tubarao'], emoji: '🦈' },
    { keys: ['crocodilo'], emoji: '🐊' },
    { keys: ['aranha'], emoji: '🕷️' },
    { keys: ['escorpiao'], emoji: '🦂' },
    { keys: ['sapo'], emoji: '🐸' },
    { keys: ['aguia'], emoji: '🦅' },
    { keys: ['abutre'], emoji: '🦅' },
    { keys: ['leao'], emoji: '🦁' },
    { keys: ['tigre'], emoji: '🐯' },
    { keys: ['constritora', 'snake'], emoji: '🐍' },
    { keys: ['alce'], emoji: '🦌' },
    { keys: ['rinoceronte'], emoji: '🦏' },
    { keys: ['baleia'], emoji: '🐋' },
    { keys: ['babuino'], emoji: '🐒' },
    { keys: ['texugo'], emoji: '🦡' },
    { keys: ['morcego'], emoji: '🦇' },
    { keys: ['lagarto'], emoji: '🦎' },
    { keys: ['gato'], emoji: '🐱' }
];

/**
 * Retorna o emoji que representa a criatura.
 */
function getBeastEmoji(name) {
    const n = normalizeStr(name);
    const found = beastEmojis.find(e => e.keys.some(k => n.includes(k)));
    return found ? found.emoji : '🐾';
}

/**
 * Busca uma criatura pelo nome. 
 * Aceita buscas parciais para facilitar o uso no teclado do celular.
 */
function getBeast(name) {
    const search = normalizeStr(name);
    return beasts.find(b =>
        normalizeStr(b.nome).includes(search)
    );
}

/**
 * Busca fera pelo índice no JSON
 */
function getBeastByIndex(index) {
    return beasts[index] || null;
}

function formatBeast(beast) {
    const emojis = {
        "terrestre": "⛰️",
        "aereo": "🦅",
        "aquatico": "🌊",
        "escavacao": "⛏️"
    };
    
    // Formata os tipos individuais de deslocamento
    const tiposFormatados = beast.tipo_deslocamento
        ? beast.tipo_deslocamento.split('/')
            .map(t => t.trim())
            .map(t => {
                const clean = normalizeStr(t);
                return `${emojis[clean] || '🐾'} ${t}`;
            })
            .join(' | ')
        : '🐾 Desconhecido';

    const attacksFormatted = beast.ataques && beast.ataques.length > 0
        ? beast.ataques.map(atk => {
            let res = `• *${atk.nome}*: Acerto ${atk.bonus_acerto} | Dano: ${atk.dado_dano} (${atk.media_dano}) de ${atk.tipo_dano}`;
            if (atk.efeito_adicional) {
                res += `\n  _${atk.efeito_adicional}_`;
            }
            return res;
        }).join('\n')
        : 'Nenhum ataque listado';

    return `
📖 *FICHA DE CRIATURA*
━━━━━━━━━━━━━━━━━━━━
${getBeastEmoji(beast.nome)} *${beast.nome.toUpperCase()}*
⭐ *ND:* ${beast.nd} | ${tiposFormatados}
⚔️ *Qtd. Ataques:* ${beast.quantidade_ataques}

🛡️ *DEFESA*
• *CA:* ${beast.defesa}
• *HP:* ${beast.hp}

📊 *ATRIBUTOS (MOD)*
💪 \`FOR: ${beast.atributos.FOR}\`
🎯 \`DES: ${beast.atributos.DES}\`
🛡️ \`CON: ${beast.atributos.CON}\`
🧠 \`INT: ${beast.atributos.INT}\`
👁️ \`SAB: ${beast.atributos.SAB}\`
🗣️ \`CAR: ${beast.atributos.CAR}\`

⚔️ *ATAQUES*
${attacksFormatted}

━━━━━━━━━━━━━━━━━━━━
🔗 [Acesse a ficha no D&D Beyond](${beast.link})
━━━━━━━━━━━━━━━━━━━━
_Dica: Use /beast <nome> para buscar detalhes._`;
}


/**
 * Retorna os botões principais de filtro
 */
function getFilterButtons() {
    return {
        inline_keyboard: [
            [
                { text: "⭐ Por ND", callback_data: "filter_nd_menu" },
                { text: "🐾 Por Tipo", callback_data: "filter_tipo_menu" }
            ]
        ]
    };
}

/**
 * Cria botões dinâmicos para os NDs que existem no JSON
 */
function getNDMenu() {
    // Pega todos os NDs únicos e ordena
    const nds = [...new Set(beasts.map(b => b.nd))].sort((a, b) => evalND(a) - evalND(b));

    // Cria os botões (3 por linha)
    const buttons = [];
    for (let i = 0; i < nds.length; i += 3) {
        const row = nds.slice(i, i + 3).map(nd => ({
            text: `ND ${nd}`,
            callback_data: `list_nd_${nd}`
        }));
        buttons.push(row);
    }
    buttons.push([{ text: "⬅️ Voltar", callback_data: "filter_main" }]);
    return { inline_keyboard: buttons };
}

/**
 * Menu dinâmico de tipos a partir de tipo_deslocamento
 */
function getTipoMenu() {
    const typesSet = new Set();
    beasts.forEach(b => {
        if (b.tipo_deslocamento) {
            b.tipo_deslocamento.split('/').forEach(t => typesSet.add(t.trim()));
        }
    });
    const types = [...typesSet].sort();
    
    const emojis = {
        "Terrestre": "⛰️",
        "Aéreo": "🦅",
        "Aquático": "🌊",
        "Escavação": "⛏️"
    };

    const buttons = [];
    for (let i = 0; i < types.length; i += 2) {
        const row = types.slice(i, i + 2).map(t => ({
            text: `${emojis[t] || '🐾'} ${t}`,
            callback_data: `list_tipo_${normalizeStr(t)}`
        }));
        buttons.push(row);
    }
    buttons.push([{ text: "⬅️ Voltar", callback_data: "filter_main" }]);
    return { inline_keyboard: buttons };
}

/**
 * Normaliza e extrai critério, valor e número da página de uma string de callback.
 */
function parseCallback(data) {
    const parts = data.split('_');
    let page = 1;
    let valueParts = parts.slice(2);
    
    if (valueParts.length > 0) {
        const lastPart = valueParts[valueParts.length - 1];
        if (/^p\d+$/.test(lastPart)) {
            page = parseInt(lastPart.substring(1), 10);
            valueParts = valueParts.slice(0, -1);
        }
    }
    
    const criteria = parts[1];
    const value = valueParts.join('_');
    
    return { criteria, value, page };
}

/**
 * Extrai índice da fera e contexto da lista de um callback b_show_.
 * Formato: b_show_<index>_<criteria>_<value>_p<page>
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
 * Botão para voltar da ficha da fera para a lista filtrada.
 */
function getBackToListButton(criteria, value, page) {
    return {
        inline_keyboard: [[{
            text: "⬅️ Voltar à lista",
            callback_data: `list_${criteria}_${value}_p${page}`
        }]]
    };
}

/**
 * Filtra a lista, realiza a paginação de 10 em 10 itens e retorna
 * as feras como botões clicáveis (mesma lógica dos monstros).
 */
function listByFilter(criteria, value, page = 1) {
    const filtered = beasts
        .map((beast, index) => ({ beast, index }))
        .filter(({ beast: b }) => {
            if (criteria === 'nd') return b.nd.toString() === value.toString();
            if (criteria === 'tipo') {
                return normalizeStr(b.tipo_deslocamento).includes(normalizeStr(value));
            }
            return false;
        });

    if (filtered.length === 0) {
        return {
            text: "Nenhuma criatura encontrada.",
            markup: { inline_keyboard: [[{ text: "⬅️ Voltar", callback_data: "filter_main" }]] }
        };
    }

    const itemsPerPage = 10;
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const currentPage = Math.max(1, Math.min(page, totalPages));
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = filtered.slice(startIndex, endIndex);

    const infoText = `🔎 *Feras (${value}):*\n_Página ${currentPage} de ${totalPages} (Total: ${filtered.length})_\n\nToque em uma fera para ver a ficha:`;

    // Botões das feras (1 por linha), ex: "🐺 Lobo (Wolf)"
    const beastButtons = paginatedItems.map(({ beast: b, index }) => ([{
        text: `${getBeastEmoji(b.nome)} ${b.nome}`,
        callback_data: `b_show_${index}_${criteria}_${value}_p${currentPage}`
    }]));

    // Botões de navegação destacados com indicador de página
    const navButtons = [];
    if (totalPages > 1) {
        if (currentPage > 1) {
            navButtons.push({
                text: "⏪ ANTERIOR",
                callback_data: `list_${criteria}_${value}_p${currentPage - 1}`
            });
        }
        navButtons.push({
            text: `📄 ${currentPage}/${totalPages}`,
            callback_data: "noop"
        });
        if (currentPage < totalPages) {
            navButtons.push({
                text: "PRÓXIMA ⏩",
                callback_data: `list_${criteria}_${value}_p${currentPage + 1}`
            });
        }
    }

    const inline_keyboard = [...beastButtons];
    if (navButtons.length > 0) {
        inline_keyboard.push(navButtons);
    }
    inline_keyboard.push([{ text: "🔙 Voltar aos Filtros", callback_data: "filter_main" }]);

    return {
        text: infoText,
        markup: { inline_keyboard }
    };
}

module.exports = {
    getBeast,
    getBeastByIndex,
    formatBeast,
    getFilterButtons,
    getNDMenu,
    getTipoMenu,
    parseCallback,
    parseShowCallback,
    getBackToListButton,
    listByFilter
};