const racesData = {
    "anao": {
        nome: "Anão",
        descricao: "Criaturas atarracadas e robustas, conhecidas por sua habilidade em mineração, forja e combate tático. Vivem centenas de anos em reinos montanhosos escavados na pedra.",
        bonus: [
            "+2 em Constituição",
            "Visão no Escuro (Darkvision)",
            "Resiliência Anã (Vantagem em testes contra veneno e resistência a dano venenoso)",
            "Proficiência com ferramentas de artesão e armas anãs (machados, martelos)"
        ],
        onus: [
            "Deslocamento base reduzido (7,5m em vez de 9m)",
            "Geralmente não são adeptos da magia arcana"
        ]
    },
    "elfo": {
        nome: "Elfo",
        descricao: "Seres graciosos e mágicos, conhecidos por sua longevidade, agilidade e profunda conexão com a natureza e a magia. Vivem em harmonia em antigas florestas.",
        bonus: [
            "+2 em Destreza",
            "Visão no Escuro (Darkvision)",
            "Vantagem contra serem enfeitiçados e imunidade a magias de sono",
            "Transe (não precisam dormir, apenas meditar por 4h diárias)",
            "Proficiência inata em Percepção"
        ],
        onus: [
            "Mais frágeis fisicamente quando comparados a raças mais parrudas",
            "A vida longa frequentemente os afasta das emoções curtas de outras raças"
        ]
    },
    "halfling": {
        nome: "Halfling",
        descricao: "Pequeninos, amigáveis e extremamente sortudos. Evitam grandes conflitos, preferindo a paz de suas vilas, uma lareira quente e uma boa refeição.",
        bonus: [
            "+2 em Destreza",
            "Sorte (Pode rerolar resultados 1 no d20 em ataques, testes de habilidade ou resistência e ficar com o novo resultado)",
            "Bravura (Vantagem em testes contra ficar amedrontado)",
            "Agilidade Halfling (Pode passar pelo espaço de criaturas maiores)"
        ],
        onus: [
            "Tamanho Pequeno (limita ou penaliza o uso de armas pesadas)",
            "Deslocamento base reduzido (7,5m)"
        ]
    },
    "humano": {
        nome: "Humano",
        descricao: "A raça mais adaptável, ambiciosa e versátil de todas. O que lhes falta em vida longa e habilidades mágicas inatas, compensam com pura determinação.",
        bonus: [
            "+1 em todos os atributos (ou +1 em dois e um Talento extra, na regra variante)",
            "Extremamente versáteis, adaptam-se facilmente a qualquer classe",
            "Aprendem um idioma extra à escolha do jogador"
        ],
        onus: [
            "Não possuem visão no escuro",
            "Nenhuma habilidade racial mágica ou de sobrevivência específica"
        ]
    },
    "draconato": {
        nome: "Draconato (Dragonborn)",
        descricao: "Humanoides com características de dragões. Seres orgulhosos e devotados aos seus clãs, carregam literalmente o legado e o poder dracônico em seu sangue.",
        bonus: [
            "+2 em Força e +1 em Carisma",
            "Ataque de Sopro (Dano em área baseado na ancestralidade dracônica, ex: fogo, gelo, ácido)",
            "Resistência a dano (Ganha resistência passiva do mesmo tipo do seu sopro)"
        ],
        onus: [
            "Não possuem visão no escuro nativa",
            "O sopro é limitante, podendo ser usado apenas uma vez por descanso (curto/longo)"
        ]
    },
    "gnomo": {
        nome: "Gnomo",
        descricao: "Criaturinhas curiosas, exóticas e altamente inventivas. Possuem uma afinidade inata e muito forte com ilusões, tecnologia e mecanismos engrenados.",
        bonus: [
            "+2 em Inteligência",
            "Visão no Escuro (Darkvision)",
            "Esperteza Gnômica (Vantagem em testes de resistência de Inteligência, Sabedoria e Carisma contra magias)"
        ],
        onus: [
            "Tamanho Pequeno (penalidades com armas muito pesadas e de alcance)",
            "Deslocamento base reduzido (7,5m)"
        ]
    },
    "meio_elfo": {
        nome: "Meio-Elfo",
        descricao: "Herdeiros da graciosidade élfica e da versatilidade humana. Muitos sentem não pertencer a nenhum dos dois mundos, tornando-se embaixadores ou aventureiros solitários.",
        bonus: [
            "+2 em Carisma e +1 em outros dois atributos à escolha",
            "Visão no Escuro (Darkvision)",
            "Ancestralidade Feérica (Vantagem contra encantamentos e imunidade a sono mágico)",
            "Versatilidade em Perícias (Ganham proficiência em 2 perícias extras à escolha)"
        ],
        onus: [
            "Apesar de ótimos diplomatas, lutam com solidão por não terem uma pátria racial exclusiva"
        ]
    },
    "meio_orc": {
        nome: "Meio-Orc",
        descricao: "Criaturas imponentes que combinam a força crua dos orcs com a engenhosidade humana. São conhecidos pela sua incrível resiliência em batalha.",
        bonus: [
            "+2 em Força e +1 em Constituição",
            "Visão no Escuro (Darkvision)",
            "Resistência Implacável (Se caírem a 0 HP, podem escolher ficar com 1 HP em vez de cair inconscientes - 1/descanso)",
            "Ataques Selvagens (Dano extra ao causar um Acerto Crítico em combate corpo-a-corpo)",
            "Proficiência inata em Intimidação"
        ],
        onus: [
            "Sofrem constante preconceito e aversão social em cidades civilizadas",
            "Foco quase exclusivo em combate físico, sem benefícios mágicos inatos"
        ]
    },
    "tiefling": {
        nome: "Tiefling",
        descricao: "Descendentes de humanos com alguma linhagem infernal do passado. Geralmente exibem chifres, caudas longas e pele de tons vermelhos, roxos ou até azuis.",
        bonus: [
            "+2 em Carisma e +1 em Inteligência",
            "Visão no Escuro (Darkvision)",
            "Resistência Infernal (Resistência natural a dano de fogo)",
            "Legado Infernal (Conhecem truques base e ganham acesso a magias obscuras nos níveis 3 e 5 de graça)"
        ],
        onus: [
            "Vítimas de puro preconceito, medo e ódio onde quer que vão",
            "Chamam muita atenção indesejada devido à sua aparência demoníaca"
        ]
    }
};

function getRacesMenu() {
    return {
        inline_keyboard: [
            [{ text: "🪓 Anão", callback_data: "race_anao" }, { text: "🏹 Elfo", callback_data: "race_elfo" }, { text: "🥧 Halfling", callback_data: "race_halfling" }],
            [{ text: "🧑 Humano", callback_data: "race_humano" }, { text: "🐉 Draconato", callback_data: "race_draconato" }, { text: "⚙️ Gnomo", callback_data: "race_gnomo" }],
            [{ text: "🧝 Meio-Elfo", callback_data: "race_meio_elfo" }, { text: "🦷 Meio-Orc", callback_data: "race_meio_orc" }, { text: "🔥 Tiefling", callback_data: "race_tiefling" }],
            [{ text: "⬅️ Voltar ao Menu Principal", callback_data: "cmd_menu" }]
        ]
    };
}

function getRaceInfo(raceKey) {
    const race = racesData[raceKey];
    if (!race) return "❌ Raça não encontrada.";

    const bonusList = race.bonus.map(b => `- ${b}`).join('\n');
    const onusList = race.onus.map(o => `- ${o}`).join('\n');

    return `🧬 *Raça: ${race.nome}*

📖 *Descrição:*
${race.descricao}

✅ *Bônus / Vantagens:*
${bonusList}

❌ *Ônus / Desvantagens:*
${onusList}`;
}

module.exports = {
    getRacesMenu,
    getRaceInfo
};
