const monsters = require('./data/monsters.json');

/**
 * Busca monstro por nome (suporta busca parcial)
 */
function getMonster(name) {
    const search = name.toLowerCase();
    return monsters.find(m => m.name.toLowerCase().includes(search));
}

/**
 * Calcula modificador (D&D 5e)
 */
function getMod(val) {
    const mod = Math.floor((val - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
}

/**
 * Formata a ficha do monstro com Link e Modificadores
 */
function formatMonster(monster) {
    return `
👹 *${monster.name.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━━
✨ *ND:* ${monster.cr} | 📏 *Tam:* ${monster.size}
⚖️ *Alinhamento:* ${monster.align}
🛡️ *Defesa:* AC ${monster.ac} | ❤️ *HP:* ${monster.hp}
👟 *Movimento:* ${monster.speed}

📊 *ATRIBUTOS (MOD)*
\`STR: ${monster.str.toString().padEnd(2)} (${getMod(monster.str)})\`
\`DEX: ${monster.dex.toString().padEnd(2)} (${getMod(monster.dex)})\`
\`CON: ${monster.con.toString().padEnd(2)} (${getMod(monster.con)})\`
\`INT: ${monster.int.toString().padEnd(2)} (${getMod(monster.int)})\`
\`WIS: ${monster.wis.toString().padEnd(2)} (${getMod(monster.wis)})\`
\`CHA: ${monster.cha.toString().padEnd(2)} (${getMod(monster.cha)})\`

🔗 [Acesse a ficha completa](${monster.url})
━━━━━━━━━━━━━━━━━━━━
_Fonte: ${monster.source}_`;
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
    const crs = [...new Set(monsters.map(m => m.cr))].sort((a, b) => {
        return parseFloat(a) - parseFloat(b);
    });

    const buttons = [];
    for (let i = 0; i < crs.length; i += 3) {
        const row = crs.slice(i, i + 3).map(cr => ({
            text: `ND ${cr}`,
            callback_data: `m_list_cr_${cr}`
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
    const types = [...new Set(monsters.map(m => m.type))].sort();
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
        if (criteria === 'cr') return m.cr.toString() === value.toString();
        if (criteria === 'type') return m.type === value;
        return false;
    });

    if (filtered.length === 0) return "Nenhum monstro encontrado.";

    // Limita a 20 resultados para não bugar o Telegram, caso a lista seja gigante
    const lista = filtered.slice(0, 20).map(m => `• /monster ${m.name}`).join('\n');
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