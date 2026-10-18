const spells = require('./data/spells.json');

/** Normaliza para busca sem acento/caixa. */
function normalizeStr(str) {
    if (!str) return '';
    return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// Classes que têm magias no SRD (index -> rótulo PT). Ordem dos botões.
const CLASSES = [
    ['bard', '🎵 Bardo'], ['cleric', '✨ Clérigo'], ['druid', '🍃 Druida'],
    ['paladin', '🛡️ Paladino'], ['ranger', '🏹 Patrulheiro'], ['sorcerer', '🔮 Feiticeiro'],
    ['warlock', '👁️ Bruxo'], ['wizard', '📖 Mago']
];

/** Rótulo do nível (0 = Truque). */
function nivelLabel(n) {
    return n === 0 ? 'Truque (Cantrip)' : `Nível ${n}`;
}

/**
 * Neutraliza caracteres que quebram o parse_mode Markdown (legado) no texto livre.
 * Mantém a mensagem robusta mesmo com descrições cheias de símbolos/tabelas.
 */
function mdSafe(s) {
    if (!s) return '';
    return s.replace(/[*_`]/g, '').replace(/\[/g, '(').replace(/\]/g, ')');
}

/** Busca magia por nome em PT ou inglês (parcial, sem acento). */
function getSpell(name) {
    const q = normalizeStr(name);
    return spells.find(s => normalizeStr(s.nome).includes(q) || normalizeStr(s.nome_en).includes(q));
}

function getSpellByIndex(i) {
    return spells[parseInt(i, 10)] ?? null;
}

/** Menu inicial: escolher classe (ou todas). */
function getClassMenu() {
    const rows = [];
    for (let i = 0; i < CLASSES.length; i += 2) {
        rows.push(CLASSES.slice(i, i + 2).map(([key, label]) => ({
            text: label, callback_data: `sp_c_${key}`
        })));
    }
    rows.push([{ text: "🌐 Todas as classes", callback_data: "sp_c_all" }]);
    rows.push([{ text: "🏠 Menu Principal", callback_data: "cmd_menu" }]);
    return { inline_keyboard: rows };
}

/** Menu de níveis para a classe escolhida (só mostra níveis que existem). */
function getLevelMenu(classKey) {
    const pool = classKey === 'all' ? spells : spells.filter(s => s.classes.includes(classKey));
    const niveis = [...new Set(pool.map(s => s.nivel))].sort((a, b) => a - b);

    const rows = [];
    const botoes = niveis.map(n => ({
        text: n === 0 ? '✨ Truques' : `Nível ${n}`,
        callback_data: `sp_l_${classKey}_${n}`
    }));
    for (let i = 0; i < botoes.length; i += 3) rows.push(botoes.slice(i, i + 3));
    rows.push([{ text: "🌐 Todos os níveis", callback_data: `sp_l_${classKey}_all` }]);
    rows.push([{ text: "⬅️ Trocar Classe", callback_data: "sp_class" }]);
    return { inline_keyboard: rows };
}

/** Parse de "sp_l_<class>_<level>[_p<page>]" (class e level são tokens simples). */
function parseList(data) {
    const p = data.split('_'); // sp l class level [pN]
    const classKey = p[2];
    const level = p[3];
    let page = 1;
    if (p[4] && /^p\d+$/.test(p[4])) page = parseInt(p[4].slice(1), 10);
    return { classKey, level, page };
}

/** Parse de "sp_show_<index>_<class>_<level>[_p<page>]". */
function parseShow(data) {
    const p = data.split('_'); // sp show index class level [pN]
    const index = parseInt(p[2], 10);
    const classKey = p[3];
    const level = p[4];
    let page = 1;
    if (p[5] && /^p\d+$/.test(p[5])) page = parseInt(p[5].slice(1), 10);
    return { index, classKey, level, page };
}

/** Lista magias filtradas por classe+nível, paginada (10/página). */
function listByFilter(classKey, level, page = 1) {
    const filtered = spells
        .map((spell, index) => ({ spell, index }))
        .filter(({ spell: s }) =>
            (classKey === 'all' || s.classes.includes(classKey)) &&
            (level === 'all' || s.nivel === parseInt(level, 10))
        );

    if (filtered.length === 0) {
        return {
            text: "Nenhuma magia encontrada para esse filtro.",
            markup: { inline_keyboard: [[{ text: "⬅️ Voltar", callback_data: `sp_c_${classKey}` }]] }
        };
    }

    const perPage = 10;
    const totalPages = Math.ceil(filtered.length / perPage);
    const cur = Math.max(1, Math.min(page, totalPages));
    const slice = filtered.slice((cur - 1) * perPage, cur * perPage);

    const classLabel = classKey === 'all' ? 'Todas as classes' : (CLASSES.find(c => c[0] === classKey)?.[1] || classKey);
    const lvlLabel = level === 'all' ? 'Todos os níveis' : nivelLabel(parseInt(level, 10));
    const info = `✨ *Feitiços* — ${classLabel} · ${lvlLabel}\n_Página ${cur} de ${totalPages} (Total: ${filtered.length})_\n\nToque numa magia para ver a ficha:`;

    const spellButtons = slice.map(({ spell: s, index }) => ([{
        text: `${s.nivel === 0 ? '✨' : 'N' + s.nivel} ${s.nome}`,
        callback_data: `sp_show_${index}_${classKey}_${level}_p${cur}`
    }]));

    const nav = [];
    if (totalPages > 1) {
        if (cur > 1) nav.push({ text: "⏪ ANTERIOR", callback_data: `sp_l_${classKey}_${level}_p${cur - 1}` });
        nav.push({ text: `📄 ${cur}/${totalPages}`, callback_data: "noop" });
        if (cur < totalPages) nav.push({ text: "PRÓXIMA ⏩", callback_data: `sp_l_${classKey}_${level}_p${cur + 1}` });
    }

    const inline_keyboard = [...spellButtons];
    if (nav.length) inline_keyboard.push(nav);
    inline_keyboard.push([{ text: "🔙 Trocar Nível", callback_data: `sp_c_${classKey}` }]);
    return { text: info, markup: { inline_keyboard } };
}

/** Botão de volta da ficha para a lista filtrada. */
function getBackToListButton(classKey, level, page) {
    return { inline_keyboard: [[{ text: "⬅️ Voltar à lista", callback_data: `sp_l_${classKey}_${level}_p${page}` }]] };
}

/** Ficha da magia (melhor que o app de referência: ícones + info condensada). */
function formatSpell(s) {
    const linhas = [];
    const en = s.nome_en && s.nome !== s.nome_en ? ` _(${mdSafe(s.nome_en)})_` : '';
    linhas.push(`✨ *${mdSafe(s.nome)}*${en}`);
    linhas.push('━━━━━━━━━━━━━━━━━━━━');
    linhas.push(`🎚️ *${nivelLabel(s.nivel)}* · 🏫 _${s.escola}_`);
    linhas.push(`⏱️ *Conjuração:* ${mdSafe(s.tempo)}`);
    linhas.push(`🎯 *Alcance:* ${mdSafe(s.alcance)}`);
    let comp = s.componentes;
    if (s.material) comp += ` (${mdSafe(s.material)})`;
    linhas.push(`🧩 *Componentes:* ${comp}`);
    let dur = mdSafe(s.duracao);
    if (s.concentracao) dur += ' ⏳ _(Concentração)_';
    linhas.push(`🕒 *Duração:* ${dur}`);
    if (s.ritual) linhas.push(`🔁 *Ritual*`);
    if (s.salvaguarda) linhas.push(`💾 *Salvaguarda:* ${s.salvaguarda}`);
    if (s.ataque) linhas.push(`⚔️ *Ataque:* ${s.ataque === 'ranged' ? 'À distância' : 'Corpo a corpo'}`);
    linhas.push(`🎓 *Classes:* ${s.classesPt}`);
    linhas.push('━━━━━━━━━━━━━━━━━━━━');

    let desc = mdSafe(s.desc);
    if (desc.length > 2800) desc = desc.slice(0, 2800) + '…';
    if (!s.traduzido) desc = `_(descrição ainda em inglês)_\n${desc}`;
    linhas.push(`📜 ${desc}`);
    if (s.niveis_superiores) {
        let up = mdSafe(s.niveis_superiores);
        if (up.length > 600) up = up.slice(0, 600) + '…';
        linhas.push(`\n🔼 *Em níveis superiores:* ${up}`);
    }
    return linhas.join('\n');
}

module.exports = {
    getSpell, getSpellByIndex, getClassMenu, getLevelMenu,
    parseList, parseShow, listByFilter, getBackToListButton, formatSpell
};
