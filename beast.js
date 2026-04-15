const beasts = require('./data/beast.json');

/**
 * Busca uma criatura pelo nome. 
 * Aceita buscas parciais para facilitar o uso no teclado do celular.
 */
function getBeast(name) {
    const search = name.toLowerCase();
    return beasts.find(b =>
        b.name.toLowerCase().includes(search)
    );
}

/**
 * Calcula o modificador de atributo e formata com sinal de + ou -
 */
function getMod(val) {
    const mod = Math.floor((val - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`; // O sinal de - já vem nativo em números negativos
}

function formatBeast(beast) {
    const tiposEmoji = { "terrestre": "⛰️", "voador": "🦅", "aquatico": "🌊" };
    const tiposFormatados = beast.tipo
        .map(t => `${tiposEmoji[t] || '🐾'} ${t.charAt(0).toUpperCase() + t.slice(1)}`)
        .join(' | ');

    return `
📖 *FICHA DE CRIATURA*
━━━━━━━━━━━━━━━━━━━━
👹 *${beast.name.toUpperCase()}*
⭐ *ND:* ${beast.nd} | ${tiposFormatados}

🛡️ *DEFESA*
• *CA:* ${beast.ac}
• *HP:* ${beast.hp}

📊 *ATRIBUTOS (MOD)*
\`STR: ${beast.str.toString().padEnd(2)} (${getMod(beast.str)})\`
\`DEX: ${beast.dex.toString().padEnd(2)} (${getMod(beast.dex)})\`
\`CON: ${beast.con.toString().padEnd(2)} (${getMod(beast.con)})\`
\`INT: ${beast.int.toString().padEnd(2)} (${getMod(beast.int)})\`
\`SAB: ${beast.sab.toString().padEnd(2)} (${getMod(beast.sab)})\`
\`CHA: ${beast.cha.toString().padEnd(2)} (${getMod(beast.cha)})\`

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
    const nds = [...new Set(beasts.map(b => b.nd))].sort((a, b) => a - b);

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
 * Menu fixo de tipos
 */
function getTipoMenu() {
    return {
        inline_keyboard: [
            [{ text: "⛰️ Terrestre", callback_data: "list_tipo_terrestre" }],
            [{ text: "🦅 Voador", callback_data: "list_tipo_voador" }],
            [{ text: "🌊 Aquático", callback_data: "list_tipo_aquatico" }],
            [{ text: "⬅️ Voltar", callback_data: "filter_main" }]
        ]
    };
}

/**
 * Filtra a lista e retorna os nomes
 */
function listByFilter(criteria, value) {
    const filtered = beasts.filter(b => {
        if (criteria === 'nd') return b.nd.toString() === value.toString();
        if (criteria === 'tipo') return b.tipo.includes(value);
        return false;
    });

    if (filtered.length === 0) return "Nenhum bicho encontrado.";

    const lista = filtered.map(b => `• /beast ${b.name}`).join('\n');
    return `🔎 *Resultados (${value}):*\n\n${lista}`;
}

module.exports = {
    getBeast,
    formatBeast,
    getFilterButtons,
    getNDMenu,
    getTipoMenu,
    listByFilter
};