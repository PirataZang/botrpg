const climas = [
    {
        nome: "☀️ Ensolarado",
        descricao: "Céu claro e temperatura agradável. Nenhuma penalidade."
    },
    {
        nome: "🌧️ Chuvoso",
        descricao: "Chuva moderada. Fogueiras ao ar livre apagam facilmente e testes de percepção baseados em audição têm desvantagem."
    },
    {
        nome: "☁️ Nublado",
        descricao: "Nuvens escuras cobrem o céu. Desvantagem em testes de visão para longas distâncias."
    },
    {
        nome: "🟤 Lamaçento",
        descricao: "O chão virou um pântano após fortes chuvas. Terreno difícil, reduzindo o deslocamento pela metade."
    },
    {
        nome: "❄️ Nevasca",
        descricao: "Frio intenso e neve densa. Visibilidade muito reduzida. Testes de resistência contra frio/exaustão podem ser necessários."
    },
    {
        nome: "🌪️ Tempestade de Areia",
        descricao: "Ventos fortes carregam detritos. Visão reduzida a quase zero e é necessário cobrir o rosto para não asfixiar. Dano contínuo pequeno se desprotegido."
    },
    {
        nome: "⛈️ Tempestade Elétrica",
        descricao: "Chuvas torrenciais, trovões altos e raios. Barulho ensurdecedor anula percepção auditiva. Pequena chance de ser atingido por um raio se estiver em campo aberto."
    },
    {
        nome: "🌫️ Névoa Densa",
        descricao: "Uma névoa espessa cobre o solo. Terreno ligeiramente confuso e a visão é reduzida a 1,5 metros (cegueira para além disso)."
    },
    {
        nome: "🔥 Calor Extremo",
        descricao: "Um sol escaldante castiga o grupo. Criaturas expostas ao sol devem fazer testes de resistência contra exaustão e precisam do dobro de água."
    },
    {
        nome: "💨 Vento Uivante",
        descricao: "Ventos fortes e barulhentos. Desvantagem em testes de audição e ataques à distância com armas de projétil (como arcos e bestas)."
    }
];

function getRandomWeather() {
    const randomIndex = Math.floor(Math.random() * climas.length);
    return climas[randomIndex];
}

module.exports = {
    getRandomWeather
};
