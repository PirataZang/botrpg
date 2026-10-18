const monsters = require('./data/Monsters.json');
const itens = require('./data/itens.json');

/** Avalia o valor numérico de um ND (inclui frações tipo "1/4"). */
function evalND(nd) {
    if (!nd) return 0;
    if (typeof nd === 'number') return nd;
    if (nd.includes('/')) {
        const [num, den] = nd.split('/').map(Number);
        return num / den;
    }
    return Number(nd);
}

/** Inteiro aleatório entre min e max (inclusivos). */
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Sorteia `n` itens distintos de um array (ou todos, se o array for menor). */
function sample(arr, n) {
    const copy = [...arr];
    const out = [];
    while (copy.length && out.length < n) {
        out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
    }
    return out;
}

const ambientes = [
    "🕯️ Catacumbas úmidas, cheiro de mofo e tochas que mal iluminam o caminho.",
    "🏛️ Ruínas de um templo esquecido, colunas rachadas e símbolos apagados nas paredes.",
    "🧊 Cavernas de gelo que estalam ao menor som; o chão é traiçoeiro.",
    "🌋 Túneis vulcânicos com rios de lava ao longe e calor sufocante.",
    "🌲 Masmorra tomada por raízes e vegetação, invadida pela floresta.",
    "💀 Cripta de um antigo senhor da guerra, repleta de sarcófagos.",
    "🕸️ Covil empoeirado coberto por teias; algo grande vive ali.",
    "💧 Esgotos inundados sob a cidade, com água até os joelhos.",
    "⛏️ Mina abandonada com trilhos quebrados e vagões enferrujados.",
    "🔮 Laboratório arcano em ruínas, frascos quebrados e runas instáveis."
];

const quests = [
    "Recuperar uma relíquia roubada antes que um culto a use em um ritual.",
    "Escoltar um NPC ferido até a saída enquanto algo o caça.",
    "Encontrar e destruir a fonte de corrupção que assola a região.",
    "Resgatar prisioneiros mantidos em jaulas no fundo da masmorra.",
    "Selar um portal que traz criaturas de outro plano.",
    "Localizar o diário de um explorador desaparecido há anos.",
    "Desarmar as armadilhas e abrir caminho para uma expedição maior.",
    "Negociar (ou lutar) com a facção que domina o local.",
    "Coletar três chaves espalhadas para abrir a câmara do tesouro.",
    "Derrotar o líder dos monstros que atacam as vilas próximas.",
    "Investigar por que os mortos da cripta voltaram a se mover.",
    "Roubar um artefato do covil sem acordar o que dorme ali."
];

// %CD% é trocado por uma CD sorteada (10–16) na geração.
const obstaculos = [
    "🕳️ *Fosso largo* — Teste de *Força (Atletismo)* ou *Destreza (Acrobacia)* CD %CD% para saltar; quem falhar cai e sofre 1d6 de dano.",
    "🌿 *Terreno difícil* — raízes e lama cobrem a sala; deslocamento reduzido à metade.",
    "🔒 *Porta emperrada* — *Força* CD %CD% para arrombar, ou *Destreza (Ladinagem)* CD %CD% com ferramentas.",
    "☠️ *Armadilha de dardos* — *Percepção/Investigação* CD %CD% para notar; ao disparar: +5 para acertar, 2d10 de dano perfurante.",
    "🌉 *Ponte quebradiça* — *Destreza (Acrobacia)* CD %CD% para atravessar sem desabar.",
    "💨 *Gás venenoso* — *Constituição* CD %CD% ao entrar, ou fica Envenenado por 1 minuto.",
    "🧗 *Parede escorregadia* — *Força (Atletismo)* CD %CD% para escalar.",
    "🔥 *Corredor em chamas* — atravessar causa 2d6 de fogo; *Destreza* CD %CD% reduz à metade.",
    "🌫️ *Escuridão mágica* — luz comum não funciona; sem visão no escuro, a criatura fica cega na área.",
    "⚖️ *Placa de pressão* — *Sabedoria (Percepção)* CD %CD% para notar antes de disparar a armadilha."
];

// Itens "decentes": úteis, acima de bugigangas, mas não raros.
const itensDecentes = [
    "*Poção de Cura* — recupera 2d4+2 PV (≈10)",
    "*Pergaminho de Magia* — contém uma magia aleatória de 1º nível",
    "*Bolsa de Moedas* — 2d6 × 10 po",
    "*Adaga de Prata* — eficaz contra licantropos e certos mortos-vivos",
    "*Corda Élfica (18 m)* — resistente, leve e atende a comandos simples",
    "*Tocha Perpétua* — emite luz como uma tocha sem se consumir",
    "*Antitoxina* — vantagem em testes de resistência contra veneno por 1 hora",
    "*Óleo Afiado* — +1 de dano na próxima arma por 1 hora",
    "*Kit de Ferramentas de Ladino* — para arrombar fechaduras e desarmar armadilhas",
    "*Gema Bruta* — vale cerca de 50 po",
    "*Rações de Viagem (5 dias)* e um cantil cheio",
    "*Poção de Escalada* — deslocamento de escalada por 1 hora"
];

// Itens "muito bom": um por baú. Mágicos de verdade.
const itensMuitoBom = [
    "*Arma Mágica +1* — +1 em ataque e dano (o Mestre escolhe o tipo)",
    "*Armadura +1* — +1 na CA",
    "*Escudo +1* — +1 na CA",
    "*Poção de Cura Maior* — recupera 4d4+4 PV (≈18)",
    "*Anel de Proteção* — +1 na CA e em todos os testes de resistência (sintonização)",
    "*Capa Élfica* — vantagem em Furtividade; quem tenta vê-lo tem desvantagem (sintonização)",
    "*Bracadeiras de Defesa* — +2 na CA quando sem armadura e sem escudo (sintonização)",
    "*Varinha de Mísseis Mágicos* — 7 cargas; lança Mísseis Mágicos",
    "*Botas Aladas* — deslocamento de voo igual ao de caminhada (sintonização)",
    "*Amuleto de Saúde* — sua Constituição vira 19 (sintonização)",
    "*Poção de Força de Gigante das Colinas* — Força 21 por 1 hora"
];

// Item de missão: o objetivo/gancho da dungeon dentro do baú.
const itensMissao = [
    "*Relíquia Sagrada Roubada* — o objetivo principal da missão",
    "*Chave Rúnica* — abre a câmara selada no fundo da dungeon",
    "*Diário do Explorador Desaparecido* — revela o próximo passo da trama",
    "*Fragmento de Artefato* — uma das peças que o vilão procura",
    "*Mapa do Covil Secreto* — leva ao esconderijo do chefe",
    "*Selo do Senhor da Guerra* — prova necessária para completar a quest",
    "*Cristal de Selamento* — necessário para fechar o portal"
];

// Recompensa da missão (além do ouro): algo que avança a história.
const recompensas = [
    "um favor de um NPC influente da região",
    "acesso a um comerciante de itens raros",
    "um item mágico à escolha do grupo (dentro do razoável)",
    "um mapa levando a um tesouro ainda maior",
    "reputação — o grupo passa a ser reconhecido e bem recebido na área",
    "um aliado que se junta ao grupo em uma próxima aventura",
    "terras ou um pequeno título concedido por um nobre grato",
    "uma montaria especial ou veículo"
];

/** Ficha compacta do monstro para o Mestre (CA, PV, ataques, atributos). */
function formatMonsterCard(m) {
    const atk = (m.lista_ataques && m.lista_ataques.length)
        ? m.lista_ataques.map(a => `    ⚔️ ${a.nome}: ${a.dano} _(méd. ${a.media})_`).join('\n')
        : '    ⚔️ Nenhum ataque listado';
    const at = m.atributos || {};
    return `👹 *${m.nome}* _(ND ${m.nd}, ${m.tipo})_
    🛡️ CA ${m.defesa} · ❤️ ${m.hp} PV · 🎯 ${m.ataques} ataque(s)
${atk}
    📊 FOR ${at.for} | DES ${at.des} | CON ${at.con} | INT ${at.int} | SAB ${at.sab} | CAR ${at.car}`;
}

/** Monta a tabela do baú (12 itens tabelados d12, embaralhados). */
function buildChest() {
    const entradas = [
        ...sample(itens, 2).map(it => ({ txt: `*${it.nome}* — _${it.descricao}_`, tag: 'aleatório' })),
        ...sample(itensDecentes, 6).map(x => ({ txt: x, tag: 'decente' })),
        { txt: '📝 *[Customizável]* — o Mestre define um item que combine com a história', tag: 'custom' },
        { txt: '📝 *[Customizável]* — o Mestre define um item que combine com a história', tag: 'custom' },
        { txt: `💎 ${itensMuitoBom[rand(0, itensMuitoBom.length - 1)]}`, tag: 'MUITO BOM' },
        { txt: `🗝️ ${itensMissao[rand(0, itensMissao.length - 1)]}`, tag: 'missão' }
    ];
    return sample(entradas, entradas.length) // embaralha para o d12 ser surpresa
        .map((e, i) => `${i + 1}. ${e.txt} _(${e.tag})_`)
        .join('\n');
}

/** Faixa de ND alvo só para dar um norte (não é balanceamento oficial). */
function ndBand(level) {
    return { min: level <= 2 ? 0 : level * 0.2, max: Math.max(0.5, level * 0.5) };
}

/** Sorteia monstros cujo ND cabe na faixa do nível; alarga/cai pra qualquer um se faltar. */
function pickMonsters(level, n) {
    const { min, max } = ndBand(level);
    let pool = monsters.filter(m => { const v = evalND(m.nd); return v >= min && v <= max; });
    if (pool.length < n) pool = monsters.filter(m => evalND(m.nd) <= max);
    if (pool.length < n) pool = monsters;
    return sample(pool, n);
}

/** Menu de seleção de nível dos jogadores (1–20). */
function getLevelMenu() {
    const rows = [];
    for (let i = 1; i <= 20; i += 5) {
        rows.push([1, 2, 3, 4, 5].map(off => {
            const lvl = i - 1 + off;
            return { text: `Nv ${lvl}`, callback_data: `dgn_lvl_${lvl}` };
        }));
    }
    rows.push([{ text: "🏠 Menu Principal", callback_data: "cmd_menu" }]);
    return { inline_keyboard: rows };
}

/** Gera a dungeon para o nível e devolve { text, markup }. */
function generate(level) {
    const ambiente = ambientes[Math.floor(Math.random() * ambientes.length)];
    const quest = quests[Math.floor(Math.random() * quests.length)];

    const mobs = pickMonsters(level, rand(1, 3))
        .map(formatMonsterCard)
        .join('\n\n');

    const bau = buildChest();

    const desafios = sample(obstaculos, rand(1, 2))
        .map(o => o.replace(/%CD%/g, rand(10, 16)))
        .join('\n');

    const ouro = rand(2, 5) * level * 10; // escala com o nível
    const recompensa = recompensas[rand(0, recompensas.length - 1)];

    const text = `🏰 *GERADOR DE DUNGEON* 🏰
━━━━━━━━━━━━━━━━━━━━
🎚️ *Nível dos jogadores:* ${level}

🗺️ *Ambiente*
${ambiente}

📜 *Quest*
${quest}

👹 *Monstros sugeridos (ficha)*
${mobs}

⚠️ *Desafios / Obstáculos*
${desafios}

🧰 *Baú do Tesouro — role 1d12*
${bau}

🏆 *Recompensa da Missão*
💰 ${ouro} po  ·  🎁 ${recompensa}

━━━━━━━━━━━━━━━━━━━━
_Mestre: use isto como um norte — ajuste o que quiser à sua história._`;

    const markup = {
        inline_keyboard: [
            [{ text: "🎲 Gerar Outra", callback_data: `dgn_lvl_${level}` }],
            [{ text: "🎚️ Trocar Nível", callback_data: "cmd_dungeon" }, { text: "🏠 Menu", callback_data: "cmd_menu" }]
        ]
    };
    return { text, markup };
}

module.exports = { getLevelMenu, generate };
