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
 * Busca uma criatura pelo nome. 
 * Aceita buscas parciais para facilitar o uso no teclado do celular.
 */
function getBeast(name) {
    const search = normalizeStr(name);
    return beasts.find(b =>
        normalizeStr(b.nome).includes(search)
    );
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
👹 *${beast.nome.toUpperCase()}*
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
 * Filtra a lista, realiza a paginação de 10 em 10 itens e retorna a mensagem e botões.
 */
function listByFilter(criteria, value, page = 1) {
    const filtered = beasts.filter(b => {
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

    const lista = paginatedItems.map(b => `• /beast ${b.nome}`).join('\n');
    
    const infoText = `🔎 *Resultados (${value}):*\n_Página ${currentPage} de ${totalPages} (Total: ${filtered.length})_\n\n${lista}`;

    // Constrói os botões de navegação
    const navButtons = [];
    if (currentPage > 1) {
        navButtons.push({
            text: "⬅️ Anterior",
            callback_data: `list_${criteria}_${value}_p${currentPage - 1}`
        });
    }
    if (currentPage < totalPages) {
        navButtons.push({
            text: "Próxima ➡️",
            callback_data: `list_${criteria}_${value}_p${currentPage + 1}`
        });
    }

    const inline_keyboard = [];
    if (navButtons.length > 0) {
        inline_keyboard.push(navButtons);
    }
    inline_keyboard.push([{ text: "⬅️ Voltar", callback_data: "filter_main" }]);

    return {
        text: infoText,
        markup: { inline_keyboard }
    };
}

module.exports = {
    getBeast,
    formatBeast,
    getFilterButtons,
    getNDMenu,
    getTipoMenu,
    parseCallback,
    listByFilter
};