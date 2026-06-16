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
 * Busca monstro por nome (suporta busca parcial)
 */
function getMonster(name) {
    const search = normalizeStr(name);
    return monsters.find(m => normalizeStr(m.nome).includes(search));
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
👹 *${monster.nome.toUpperCase()}*
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
 * Lista monstros filtrados
 */
function listByFilter(criteria, value) {
    const filtered = monsters.filter(m => {
        if (criteria === 'cr' || criteria === 'nd') return m.nd.toString() === value.toString();
        if (criteria === 'type' || criteria === 'tipo') return m.tipo === value;
        return false;
    });

    if (filtered.length === 0) return "Nenhum monstro encontrado.";

    // Limita a 20 resultados para não bugar o Telegram, caso a lista seja gigante
    const lista = filtered.slice(0, 20).map(m => `• /monster ${m.nome}`).join('\n');
    const total = filtered.length > 20 ? `\n\n_...e mais ${filtered.length - 20} monstros._` : "";

    return `🔎 *Monstros (ND ${value}):*\n\n${lista}${total}`;
}

module.exports = {
    getMonster,
    formatMonster,
    getFilterButtons,
    getCRMenu,
    getTypeMenu,
    listByFilter
};