const classes = require('./data/class.json');

/**
 * Normaliza strings para busca sem acentos e minúscula.
 */
function normalizeStr(str) {
    if (!str) return '';
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Busca classe por nome (suporta busca parcial, ex: "wizard" ou "mago").
 */
function getClass(name) {
    const search = normalizeStr(name);
    return classes.find(c => normalizeStr(c.classe).includes(search));
}

/**
 * Retorna uma classe pelo índice global.
 */
function getClassByIndex(index) {
    const idx = parseInt(index, 10);
    if (idx >= 0 && idx < classes.length) {
        return classes[idx];
    }
    return null;
}

/**
 * Retorna os botões principais das classes (3 por linha).
 */
function getClassesMenu() {
    const buttons = [];
    for (let i = 0; i < classes.length; i += 3) {
        const row = classes.slice(i, i + 3).map((c, index) => {
            const globalIndex = i + index;
            const emojis = {
                "bárbaro": "🪓",
                "bardo": "🎵",
                "clerigo": "✨",
                "druida": "🍃",
                "guerreiro": "⚔️",
                "monge": "🧘",
                "paladino": "🛡️",
                "patrulheiro (ranger)": "🏹",
                "ladino (rogue)": "🗝️",
                "feiticeiro (sorcerer)": "🔮",
                "bruxo (warlock)": "👁️",
                "mago (wizard)": "📖"
            };
            const cleanName = normalizeStr(c.classe);
            const emoji = emojis[cleanName] || "🎭";
            const shortName = c.classe.split(' ')[0];
            return {
                text: `${emoji} ${shortName}`,
                callback_data: `class_${globalIndex}`
            };
        });
        buttons.push(row);
    }
    buttons.push([{ text: "⬅️ Voltar ao Menu Principal", callback_data: "cmd_menu" }]);
    return { inline_keyboard: buttons };
}

/**
 * Formata a ficha de classe para o Telegram.
 */
function formatClass(c) {
    const armaduras = c.proficiencias_iniciais.armaduras.join(', ');
    const armas = c.proficiencias_iniciais.armas.join(', ');
    const resistências = c.proficiencias_iniciais.testes_de_resistencia.join(', ');

    const progressao = c.progressao_niveis.map(lvl => {
        return `• *Nível ${lvl.level}:* ${lvl.beneficios.join(', ')}`;
    }).join('\n');

    return `
🎓 *CLASSE: ${c.classe.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━━
📖 *Descrição:* 
_${c.descricao}_

📊 *ATRIBUTOS PRINCIPAIS*
• *Primário:* ${c.atributos_principais.primario}
• *Secundário:* ${c.atributos_principais.secundario}

❤️ *PONTOS DE VIDA (HP)*
• *Dado de Vida:* ${c.dados_de_vida.dado_por_nivel}
• *HP no Nível 1:* ${c.dados_de_vida.hp_no_nivel_1}

🛡️ *PROFICIÊNCIAS INICIAIS*
• *Armaduras:* ${armaduras}
• *Armas:* ${armas}
• *Salvaguardas:* ${resistências}

📈 *PROGRESSÃO DE NÍVEIS*
${progressao}

━━━━━━━━━━━━━━━━━━━━
🔗 [Acesse a classe no D&D Beyond](${c.link})
━━━━━━━━━━━━━━━━━━━━
_Dica: Use /class <nome> para buscar outra classe._`;
}

module.exports = {
    getClass,
    getClassByIndex,
    getClassesMenu,
    formatClass
};
