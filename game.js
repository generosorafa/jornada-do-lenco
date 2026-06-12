(function () {
  "use strict";

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  const ui = {
    age: document.getElementById("ageBadge"),
    className: document.getElementById("className"),
    progress: document.getElementById("progressText"),
    pinBoard: document.getElementById("pinBoard"),
    missions: document.getElementById("missionList"),
    timeline: document.getElementById("timelineList"),
    toast: document.getElementById("toast"),
    reset: document.getElementById("resetBtn"),
    dialog: document.getElementById("missionDialog"),
    dialogType: document.getElementById("dialogType"),
    dialogTitle: document.getElementById("dialogTitle"),
    dialogIntro: document.getElementById("dialogIntro"),
    dialogBody: document.getElementById("dialogBody"),
    dialogPrimary: document.getElementById("dialogPrimary"),
    touchInteract: document.getElementById("touchInteract"),
    storyCard: document.getElementById("storyCard"),
    storyTitle: document.getElementById("storyTitle"),
    storyText: document.getElementById("storyText"),
    storyNext: document.getElementById("storyNext"),
    storySkip: document.getElementById("storySkip"),
    sound: document.getElementById("soundBtn"),
  };

  const TAU = Math.PI * 2;
  const WORLD = { w: 1800, h: 1250 };
  const SAVE_KEY = "jornada-lenco-prototype-v1";

  const stations = [
    { id: "conselheiro", name: "Conselheiro", x: 900, y: 650, color: "#2f70b8" },
    { id: "voto", name: "Voto e Lei", x: 520, y: 390, color: "#dd4d4d" },
    { id: "nos", name: "Nos e Amarras", x: 1280, y: 395, color: "#f2b84b" },
    { id: "socorro", name: "Primeiros Socorros", x: 410, y: 850, color: "#42b7ad" },
    { id: "natureza", name: "Natureza", x: 1370, y: 845, color: "#3f9e6d" },
    { id: "acampamento", name: "Acampamento", x: 870, y: 995, color: "#c27c3c" },
    { id: "mapa", name: "Mapa e Bussola", x: 1040, y: 260, color: "#2f70b8" },
    { id: "comunidade", name: "Servico", x: 240, y: 565, color: "#dd4d4d" },
    { id: "artes", name: "Oficina", x: 1540, y: 580, color: "#8c67c6" },
    { id: "lideranca", name: "Unidade", x: 910, y: 125, color: "#26334f" },
    { id: "portal", name: "Investidura", x: 900, y: 520, color: "#f2b84b" },
  ];

  const stationMap = Object.fromEntries(stations.map((station) => [station.id, station]));

  const stages = [
    stage(10, "Amigo", "AM", "#2f70b8", [
      seq("am-voto", "Voto e Lei explicados", "Mostre que voce nao decorou apenas palavras: organize como um Amigo vive o Voto e a Lei.", "voto", ["Memorizar", "Explicar", "Viver", "Compartilhar"]),
      creation("am-criacao", "Sete dias da Criacao", "Associe cada dia ao que Deus criou. Um erro faz a revisao voltar um passo.", "voto"),
      library("am-antigo-testamento", "Estante do Antigo Testamento", "Encontre os primeiros livros do Antigo Testamento na ordem correta.", "conselheiro", ["Genesis", "Exodo", "Levitico", "Numeros", "Deuteronomio", "Josue", "Juizes", "Rute"], ["Ester", "Jo", "Salmos", "Mateus"]),
      match("am-versos", "Versos na pratica", "Ligue cada referencia biblica ao sentido principal antes da classe biblica.", "voto", [
        ["Joao 3:16", "Deus ama e salva"],
        ["Efesios 6:1-3", "Honrar pai e mae"],
        ["II Timoteo 3:16", "A Biblia ensina"],
        ["Salmo 1", "Escolher bons caminhos"],
      ]),
      delivery("am-servico", "Duas horas de servico", "Leve 4 ajudas para a comunidade: alimento, visita, projeto e oracao.", "comunidade", 4),
      match("am-civismo", "Amizade e civismo", "Conecte atitudes de amizade, Regra Aurea e Hino Nacional.", "comunidade", [
        ["Regra Aurea", "Tratar como quero ser tratado"],
        ["Bom amigo", "Ouve e ajuda"],
        ["Letra do Hino Nacional", "Joaquim Osorio Duque-Estrada"],
        ["Musica do Hino Nacional", "Francisco Manuel da Silva"],
      ]),
      plate("am-temperanca", "Prato de Daniel", "Monte um compromisso saudavel escolhendo alimentos e habitos que combinam com Daniel 1:8.", "socorro"),
      rope("am-nos", "Nos da investidura", "Guie a corda pelos pontos certos para praticar nos uteis do cartao.", "nos", ["Simples", "Direito", "Lais", "Escota"]),
    ]),
    stage(10, "Amigo da Natureza", "AN", "#3f9e6d", [
      seq("an-hino", "Hino dos Desbravadores", "Prepare uma apresentacao do hino: memoria, respeito e historia.", "voto", ["Memorizar", "Cantar", "Conhecer historia", "Apresentar"]),
      match("an-personagens", "Livramentos do Antigo Testamento", "Converse com o grupo relacionando cada personagem ao cuidado de Deus.", "voto", [
        ["Jose", "Cuidado no Egito"],
        ["Jonas", "Recomeco em Ninive"],
        ["Ester", "Coragem pelo povo"],
        ["Rute", "Fidelidade em familia"],
      ]),
      delivery("an-convidar", "Dois amigos no clube", "Leve 2 convites ate a tenda da comunidade para receber novos amigos.", "comunidade", 2),
      safety("an-boas-maneiras", "Higiene e boas maneiras", "Marque atitudes corretas para reunioes, mesa e acampamentos.", "conselheiro", ["Lavar as maos", "Ouvir antes de falar", "Servir com respeito", "Mesa organizada", "Cuidar do ambiente"]),
      tent("an-barraca", "Arte de acampar", "Monte a barraca na ordem correta, escolhendo lona, varetas, tecido, porta, nos e espeques.", "acampamento"),
      collect("an-especies", "Flores e insetos da regiao", "Registre 10 especies pelo bosque para completar a observacao da natureza.", "natureza", "especie", 10),
      fire("an-fogueira", "Fogueira de um fosforo", "Acenda uma fogueira segura com materiais naturais e mantenha a chama estavel.", "acampamento"),
      safety("an-ferramentas", "Ferramentas com seguranca", "Escolha as regras certas para faca, facao e machadinha.", "natureza", ["Cortar para longe", "Base firme", "Area livre", "Guardar com capa", "Pedir supervisao"]),
    ]),
    stage(11, "Companheiro", "CP", "#dd4d4d", [
      seq("cp-voto", "Promessa em acao", "Organize uma atitude de companheirismo.", "voto", ["Ouvir", "Ajudar", "Animar", "Agradecer"]),
      delivery("cp-servico", "Missao comunitaria", "Leve 3 cestas ate a tenda de servico.", "comunidade", 3),
      morse("cp-morse", "Codigo Morse da unidade", "Repita os sinais curtos e longos para enviar a palavra AMIGO.", "comunidade", ".- -- .. --. ---"),
    ]),
    stage(11, "Companheiro de Excursionismo", "CE", "#c27c3c", [
      collect("ce-trilha", "Trilha com mochila", "Pegue 4 pontos de rota antes de voltar ao mapa.", "mapa", "rota", 4),
      backpack("ce-mochila", "Mochila esperta", "Prepare a mochila para uma pequena excursao, sem carregar peso inutil.", "acampamento", 10),
      safety("ce-seguranca", "Trilha segura", "Marque os pontos de seguranca antes de sair com a unidade.", "mapa", ["Grupo junto", "Avisar conselheiro", "Agua", "Rota marcada"]),
    ]),
    stage(12, "Pesquisador", "PS", "#42b7ad", [
      collect("ps-pistas", "Campo de pesquisa", "Colete 5 pistas de plantas, pegadas e pedras.", "natureza", "pista", 5),
      quiz("ps-anotar", "Caderno de campo", "Como registrar uma descoberta?", "natureza", "Anotar local, data e observacao", ["So guardar na memoria", "Anotar local, data e observacao", "Chutar o nome"]),
      seq("ps-estudo", "Pesquisa em ordem", "Monte o metodo de pesquisa.", "artes", ["Observar", "Comparar", "Anotar", "Compartilhar"]),
    ]),
    stage(12, "Pesquisador de Campo e Bosque", "PB", "#3f9e6d", [
      collect("pb-bosque", "Bosque vivo", "Encontre 6 sinais de vida no bosque.", "natureza", "sinal", 6),
      plant("pb-restaurar", "Restaurar a clareira", "Plante 4 mudas para recuperar a clareira.", "natureza", 4),
      safety("pb-ferramenta", "Faca e facao com seguranca", "Clique apenas nas atitudes seguras antes de cortar um graveto.", "natureza", ["Cortar para longe", "Mao fora da linha", "Area livre", "Supervisao"]),
    ]),
    stage(13, "Pioneiro", "PN", "#f2b84b", [
      seq("pn-ponte", "Ponte pioneira", "Siga a sequencia para erguer uma pequena ponte.", "nos", ["Base", "Amarra", "Teste", "Passagem"]),
      delivery("pn-equipe", "Equipe em acao", "Distribua 4 ferramentas para a area de pioneirias.", "artes", 4),
      quiz("pn-liderar", "Liderar sem mandar", "Um bom pioneiro primeiro...", "lideranca", "Serve junto com a unidade", ["Some na hora dificil", "Serve junto com a unidade", "Grita para parecer forte"]),
    ]),
    stage(13, "Pioneiro de Novas Fronteiras", "PF", "#c27c3c", [
      seq("pf-rota", "Abrir caminho", "Planeje a nova rota do acampamento.", "mapa", ["Mapa", "Risco", "Equipe", "Partida"]),
      collect("pf-marcos", "Marcos da fronteira", "Marque 5 pontos seguros para a equipe.", "mapa", "marco", 5),
      kit("pf-ferramentas", "Ferramentas certas", "Escolha ferramentas seguras para construir.", "artes", ["Corda", "Luva", "Estaca"]),
    ]),
    stage(14, "Excursionista", "EX", "#8c67c6", [
      collect("ex-bussola", "Bussola em movimento", "Encontre 6 pontos cardeais no mapa.", "mapa", "ponto", 6),
      kit("ex-emergencia", "Plano de emergencia", "Escolha atitudes certas para uma surpresa na trilha.", "socorro", ["Parar", "Avisar", "Aguardar"]),
      rapel("ex-rapel", "Rapel controlado", "Controle a descida: devagar, com freio e sem passar do limite.", "acampamento"),
    ]),
    stage(14, "Excursionista na Mata", "EM", "#3f9e6d", [
      collect("em-trilha", "Sinais na mata", "Colete 6 sinais de trilha sem se afastar do grupo.", "natureza", "sinal", 6),
      plant("em-acampamento", "Acampamento leve", "Plante 4 marcas verdes para recuperar a area.", "acampamento", 4),
      seq("em-fogueira", "Fogueira segura", "Apague a fogueira na ordem correta.", "acampamento", ["Espalhar", "Agua", "Mexer", "Conferir"]),
    ]),
    stage(15, "Guia", "GU", "#26334f", [
      seq("gu-unidade", "Guiar a unidade", "Organize a resposta de um lider servidor.", "lideranca", ["Perceber", "Orientar", "Acompanhar", "Celebrar"]),
      delivery("gu-resgate", "Resgate da unidade", "Leve 4 kits de apoio aos colegas no mapa.", "socorro", 4),
      quiz("gu-exemplo", "Ser exemplo", "Um guia influencia melhor quando...", "lideranca", "Vive o que ensina", ["So cobra dos outros", "Vive o que ensina", "Desiste quando e dificil"]),
    ]),
    stage(15, "Guia de Exploracao", "GX", "#f2b84b", [
      collect("gx-campori", "Campori final", "Colete 7 insignias da grande jornada.", "portal", "insignia", 7),
      seq("gx-cerimonia", "Preparar investidura", "Organize a cerimonia final.", "portal", ["Cartao", "Unidade", "PIN", "Gratidao"]),
      quiz("gx-final", "Todas as classes", "Ao concluir a jornada, o proximo passo e...", "portal", "Continuar servindo e aprendendo", ["Parar de crescer", "Continuar servindo e aprendendo", "Guardar tudo so para si"]),
    ]),
  ];

  const mapDecor = {
    trees: [],
    flowers: [],
    tents: [
      { x: 780, y: 950, c: "#dd4d4d" },
      { x: 920, y: 1010, c: "#2f70b8" },
      { x: 1040, y: 940, c: "#f2b84b" },
    ],
    rocks: [],
    paths: [],
    npcs: [],
  };

  const keys = new Set();
  const pointer = { x: 0, y: 0 };
  const camera = { x: 0, y: 0 };
  const player = { x: 900, y: 650, vx: 0, vy: 0, r: 22, dir: 0, step: 0 };
  const state = {
    stageIndex: 0,
    completed: {},
    awarded: {},
    activeMissionId: null,
    field: null,
    toastTime: 0,
    selectedMissionId: null,
    storyIndex: 0,
    storySeen: false,
    sound: false,
  };

  let lastTime = performance.now();
  let seed = 45619;
  let audioCtx = null;

  const storySteps = [
    {
      title: "Bem-vindo ao clube",
      text: "Voce comecou com 10 anos. Fale com o conselheiro, complete o cartao de Amigo e conquiste seu primeiro PIN.",
    },
    {
      title: "Como jogar",
      text: "Ande pelo mapa com WASD ou setas. Chegue perto de uma estacao e aperte Espaco, ou inicie a missao pelo cartao.",
    },
    {
      title: "Cartao vivo",
      text: "Cada requisito vira uma atividade: mochila, corda, barraca, trilha, plantio, entrega e outras provas praticas.",
    },
  ];

  function stage(age, name, pin, color, missions) {
    return { age, name, pin, color, missions };
  }

  function seq(id, title, desc, station, sequence) {
    return { id, title, desc, station, kind: "sequence", sequence };
  }

  function quiz(id, title, desc, station, answer, options) {
    return { id, title, desc, station, kind: "quiz", answer, options };
  }

  function kit(id, title, desc, station, good) {
    const extras = ["Bola", "Doce", "Pedra", "Apito sem avisar", "Caderno molhado"];
    return { id, title, desc, station, kind: "kit", good, options: [...good, ...extras].slice(0, 6) };
  }

  function backpack(id, title, desc, station, weightLimit) {
    return {
      id,
      title,
      desc,
      station,
      kind: "backpack",
      weightLimit,
      items: [
        { name: "Agua", weight: 2, good: true },
        { name: "Lanterna", weight: 1, good: true },
        { name: "Capa", weight: 2, good: true },
        { name: "Biblia", weight: 1, good: true },
        { name: "Lanche", weight: 2, good: true },
        { name: "Pedra bonita", weight: 4, good: false },
        { name: "Videogame", weight: 3, good: false },
        { name: "Panela gigante", weight: 5, good: false },
      ],
    };
  }

  function rope(id, title, desc, station, points) {
    return { id, title, desc, station, kind: "rope", points };
  }

  function tent(id, title, desc, station) {
    return {
      id,
      title,
      desc,
      station,
      kind: "tent",
      steps: ["Lona", "Varetas", "Tecido", "Levantar", "Porta", "Nos", "Espeques"],
    };
  }

  function morse(id, title, desc, station, pattern) {
    return { id, title, desc, station, kind: "morse", pattern };
  }

  function safety(id, title, desc, station, targets) {
    return { id, title, desc, station, kind: "safety", targets };
  }

  function rapel(id, title, desc, station) {
    return { id, title, desc, station, kind: "rapel" };
  }

  function creation(id, title, desc, station) {
    return {
      id,
      title,
      desc,
      station,
      kind: "creation",
      days: [
        "Luz",
        "Ceu e aguas",
        "Terra, mares e plantas",
        "Sol, lua e estrelas",
        "Peixes e aves",
        "Animais e pessoas",
        "Descanso",
      ],
    };
  }

  function library(id, title, desc, station, books, extras) {
    return { id, title, desc, station, kind: "library", books, extras };
  }

  function match(id, title, desc, station, pairs) {
    return {
      id,
      title,
      desc,
      station,
      kind: "match",
      pairs: pairs.map(([prompt, answer]) => ({ prompt, answer })),
    };
  }

  function plate(id, title, desc, station) {
    return { id, title, desc, station, kind: "plate" };
  }

  function fire(id, title, desc, station) {
    return {
      id,
      title,
      desc,
      station,
      kind: "fire",
      steps: ["Ninho seco", "Gravetos finos", "Lenha pequena", "Um fosforo", "Soprar leve", "Lenha maior"],
    };
  }

  function collect(id, title, desc, station, token, needed) {
    return { id, title, desc, station, kind: "collect", token, needed };
  }

  function plant(id, title, desc, station, needed) {
    return { id, title, desc, station, kind: "plant", needed };
  }

  function delivery(id, title, desc, station, needed) {
    return { id, title, desc, station, kind: "delivery", needed };
  }

  function rand() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  }

  function between(a, b) {
    return a + (b - a) * rand();
  }

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function distance(ax, ay, bx, by) {
    return Math.hypot(ax - bx, ay - by);
  }

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rand() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function currentStage() {
    return stages[state.stageIndex];
  }

  function currentMissions() {
    return currentStage().missions;
  }

  function isMissionDone(mission) {
    return Boolean(state.completed[mission.id]);
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(640, Math.floor(rect.width * dpr));
    canvas.height = Math.max(420, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function generateDecor() {
    seed = 45619;
    mapDecor.trees.length = 0;
    mapDecor.flowers.length = 0;
    mapDecor.rocks.length = 0;
    mapDecor.npcs.length = 0;
    mapDecor.paths = [
      [900, 650, 520, 390],
      [900, 650, 1280, 395],
      [900, 650, 410, 850],
      [900, 650, 1370, 845],
      [900, 650, 870, 995],
      [900, 650, 1040, 260],
      [900, 650, 240, 565],
      [900, 650, 1540, 580],
      [900, 650, 910, 125],
    ];
    for (let i = 0; i < 85; i += 1) {
      const x = between(80, WORLD.w - 80);
      const y = between(80, WORLD.h - 80);
      if (stations.some((station) => distance(x, y, station.x, station.y) < 110)) continue;
      mapDecor.trees.push({ x, y, r: between(18, 42), c: rand() > 0.55 ? "#3f9e6d" : "#347b58" });
    }
    for (let i = 0; i < 130; i += 1) {
      mapDecor.flowers.push({
        x: between(60, WORLD.w - 60),
        y: between(60, WORLD.h - 60),
        c: ["#dd4d4d", "#f2b84b", "#2f70b8", "#ffffff", "#8c67c6"][Math.floor(rand() * 5)],
      });
    }
    for (let i = 0; i < 34; i += 1) {
      mapDecor.rocks.push({ x: between(90, WORLD.w - 90), y: between(90, WORLD.h - 90), r: between(12, 28) });
    }
    const npcColors = ["#dd4d4d", "#2f70b8", "#f2b84b", "#3f9e6d", "#8c67c6"];
    for (let i = 0; i < 9; i += 1) {
      const station = stations[(i + 1) % (stations.length - 1)];
      mapDecor.npcs.push({
        x: station.x + between(-80, 80),
        y: station.y + between(-70, 70),
        homeX: station.x,
        homeY: station.y,
        r: between(13, 17),
        c: npcColors[i % npcColors.length],
        t: between(0, TAU),
        name: ["Lia", "Davi", "Nina", "Theo", "Bia", "Rafa", "Mika", "Gabi", "Noah"][i],
      });
    }
  }

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      state.stageIndex = clamp(Number(saved.stageIndex) || 0, 0, stages.length - 1);
      state.completed = saved.completed || {};
      state.awarded = saved.awarded || {};
      state.storySeen = Boolean(saved.storySeen);
      state.sound = Boolean(saved.sound);
    } catch (error) {
      localStorage.removeItem(SAVE_KEY);
    }
  }

  function save() {
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify({
        stageIndex: state.stageIndex,
        completed: state.completed,
        awarded: state.awarded,
        storySeen: state.storySeen,
        sound: state.sound,
      }),
    );
  }

  function resetGame() {
    localStorage.removeItem(SAVE_KEY);
    state.stageIndex = 0;
    state.completed = {};
    state.awarded = {};
    state.activeMissionId = null;
    state.field = null;
    state.selectedMissionId = null;
    state.storyIndex = 0;
    state.storySeen = false;
    player.x = 900;
    player.y = 650;
    save();
    renderUi();
    renderStory();
    showToast("Novo jogo iniciado. Fale com o conselheiro ou escolha uma missao do cartao.", 3);
  }

  function showToast(text, seconds = 2.4) {
    ui.toast.textContent = text;
    ui.toast.classList.add("show");
    state.toastTime = seconds;
  }

  function renderStory() {
    if (state.storySeen) {
      ui.storyCard.classList.add("hidden");
      return;
    }
    const step = storySteps[state.storyIndex] || storySteps[storySteps.length - 1];
    ui.storyTitle.textContent = step.title;
    ui.storyText.textContent = step.text;
    ui.storyNext.textContent = state.storyIndex >= storySteps.length - 1 ? "Comecar" : "Continuar";
    ui.storyCard.classList.remove("hidden");
  }

  function closeStory() {
    state.storySeen = true;
    ui.storyCard.classList.add("hidden");
    save();
    showToast("Primeira missao: complete Voto e Lei ou fale com o Conselheiro.", 3);
  }

  function initAudio() {
    if (audioCtx) return audioCtx;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    audioCtx = new AudioContext();
    return audioCtx;
  }

  function toggleSound() {
    state.sound = !state.sound;
    if (state.sound) initAudio();
    ui.sound.textContent = `Som: ${state.sound ? "on" : "off"}`;
    save();
    playSound("click");
  }

  function playSound(type) {
    if (!state.sound) return;
    const ac = initAudio();
    if (!ac) return;
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const freqs = {
      click: [520, 420],
      done: [620, 920],
      pin: [520, 780],
      step: [160, 110],
      error: [180, 90],
      plant: [420, 680],
    };
    const [start, end] = freqs[type] || freqs.click;
    osc.type = type === "error" ? "sawtooth" : "sine";
    osc.frequency.setValueAtTime(start, now);
    osc.frequency.exponentialRampToValueAtTime(end, now + 0.14);
    gain.gain.setValueAtTime(type === "pin" ? 0.06 : 0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  function renderUi() {
    const stageNow = currentStage();
    const doneCount = stageNow.missions.filter(isMissionDone).length;
    ui.age.textContent = stageNow.age;
    ui.className.textContent = stageNow.name;
    ui.progress.textContent = `${doneCount}/${stageNow.missions.length}`;
    ui.sound.textContent = `Som: ${state.sound ? "on" : "off"}`;

    ui.pinBoard.innerHTML = "";
    stages.forEach((item, index) => {
      const pin = document.createElement("div");
      pin.className = "pin";
      pin.textContent = item.pin;
      pin.dataset.title = item.name;
      if (state.awarded[item.name]) pin.classList.add("done");
      if (index === state.stageIndex) pin.classList.add("current");
      ui.pinBoard.appendChild(pin);
    });

    ui.missions.innerHTML = "";
    stageNow.missions.forEach((mission) => {
      const row = document.createElement("article");
      row.className = `mission ${isMissionDone(mission) ? "done" : ""}`;
      const status = document.createElement("div");
      status.className = "mission-status";
      status.textContent = isMissionDone(mission) ? "✓" : "•";
      const copy = document.createElement("div");
      const title = document.createElement("p");
      title.className = "mission-title";
      title.textContent = mission.title;
      const desc = document.createElement("p");
      desc.className = "mission-desc";
      desc.textContent = stationMap[mission.station].name;
      copy.append(title, desc);
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = isMissionDone(mission) ? "Feito" : "Iniciar";
      button.disabled = isMissionDone(mission);
      button.addEventListener("click", () => openMission(mission.id));
      row.append(status, copy, button);
      ui.missions.appendChild(row);
    });

    ui.timeline.innerHTML = "";
    stages.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "timeline-row";
      if (state.awarded[item.name]) row.classList.add("done");
      if (index === state.stageIndex) row.classList.add("current");
      const age = document.createElement("span");
      age.textContent = item.age;
      const name = document.createElement("strong");
      name.textContent = item.name;
      row.append(age, name);
      ui.timeline.appendChild(row);
    });
  }

  function openMission(id) {
    const mission = currentMissions().find((item) => item.id === id);
    if (!mission || isMissionDone(mission)) return;
    if (!state.storySeen) {
      state.storySeen = true;
      ui.storyCard.classList.add("hidden");
      save();
    }
    state.selectedMissionId = id;
    state.activeMissionId = id;
    if (mission.kind === "collect" || mission.kind === "plant" || mission.kind === "delivery") {
      openFieldIntro(mission);
      return;
    }
    if (mission.kind === "sequence") openSequenceMission(mission);
    if (mission.kind === "quiz") openQuizMission(mission);
    if (mission.kind === "kit") openKitMission(mission);
    if (mission.kind === "backpack") openBackpackMission(mission);
    if (mission.kind === "rope") openRopeMission(mission);
    if (mission.kind === "tent") openTentMission(mission);
    if (mission.kind === "morse") openMorseMission(mission);
    if (mission.kind === "safety") openSafetyMission(mission);
    if (mission.kind === "rapel") openRapelMission(mission);
    if (mission.kind === "creation") openCreationMission(mission);
    if (mission.kind === "library") openLibraryMission(mission);
    if (mission.kind === "match") openMatchMission(mission);
    if (mission.kind === "plate") openPlateMission(mission);
    if (mission.kind === "fire") openFireMission(mission);
  }

  function showDialog(mission, type) {
    ui.dialogType.textContent = type;
    ui.dialogTitle.textContent = mission.title;
    ui.dialogIntro.textContent = mission.desc;
    ui.dialogBody.innerHTML = "";
    ui.dialogPrimary.textContent = "Fechar";
    ui.dialogPrimary.onclick = () => ui.dialog.close();
    if (!ui.dialog.open) ui.dialog.showModal();
  }

  function openSequenceMission(mission) {
    showDialog(mission, "Mini-game de sequencia");
    let index = 0;
    const hint = document.createElement("p");
    hint.textContent = `Ordem alvo: ${mission.sequence.join(" > ")}`;
    const progress = document.createElement("div");
    progress.className = "progress-bar";
    const fill = document.createElement("span");
    fill.className = "progress-fill";
    progress.appendChild(fill);
    const sequence = document.createElement("div");
    sequence.className = "sequence";
    shuffle(mission.sequence).forEach((token) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "sequence-token";
      button.textContent = token;
      button.addEventListener("click", () => {
        if (token === mission.sequence[index]) {
          button.classList.add("done");
          button.disabled = true;
          index += 1;
          fill.style.width = `${(index / mission.sequence.length) * 100}%`;
          if (index === mission.sequence.length) {
            completeMission(mission.id);
            setTimeout(() => ui.dialog.close(), 550);
          }
        } else {
          playSound("error");
          showToast("Quase. Recomece a sequencia com calma.", 1.8);
          index = 0;
          fill.style.width = "0%";
          sequence.querySelectorAll("button").forEach((item) => {
            item.disabled = false;
            item.classList.remove("done");
          });
        }
      });
      sequence.appendChild(button);
    });
    ui.dialogBody.append(hint, progress, sequence);
  }

  function openQuizMission(mission) {
    showDialog(mission, "Decisao de historia");
    const question = document.createElement("p");
    question.textContent = mission.desc;
    const choices = document.createElement("div");
    choices.className = "choice-grid";
    shuffle(mission.options).forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice";
      button.textContent = option;
      button.addEventListener("click", () => {
        if (option === mission.answer) {
          button.classList.add("good");
          choices.querySelectorAll("button").forEach((item) => (item.disabled = true));
          completeMission(mission.id);
          setTimeout(() => ui.dialog.close(), 650);
        } else {
          playSound("error");
          button.classList.add("bad");
          button.disabled = true;
          showToast("Essa escolha nao ajuda a unidade. Tente outra.", 1.8);
        }
      });
      choices.appendChild(button);
    });
    ui.dialogBody.append(question, choices);
  }

  function openKitMission(mission) {
    showDialog(mission, "Mini-game de escolhas");
    const selected = new Set();
    const target = new Set(mission.good);
    const choices = document.createElement("div");
    choices.className = "choice-grid";
    shuffle(mission.options).forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice";
      button.textContent = option;
      button.addEventListener("click", () => {
        if (target.has(option)) {
          selected.add(option);
          button.classList.add("good");
          button.disabled = true;
          if (selected.size === target.size) {
            completeMission(mission.id);
            setTimeout(() => ui.dialog.close(), 650);
          }
        } else {
          playSound("error");
          button.classList.add("bad");
          button.disabled = true;
          showToast("Esse item nao resolve este desafio.", 1.7);
        }
      });
      choices.appendChild(button);
    });
    const note = document.createElement("p");
    note.textContent = `Escolha ${mission.good.length} itens/acoes corretas.`;
    ui.dialogBody.append(note, choices);
  }

  function openBackpackMission(mission) {
    showDialog(mission, "Mini-game de mochila");
    const selected = new Set();
    const items = shuffle(mission.items);
    const required = mission.items.filter((item) => item.good).map((item) => item.name);

    const meter = document.createElement("div");
    meter.className = "bag-meter";
    const meterText = document.createElement("strong");
    meterText.textContent = `Peso 0/${mission.weightLimit}`;
    const meterBar = document.createElement("div");
    meterBar.className = "progress-bar";
    const meterFill = document.createElement("span");
    meterFill.className = "progress-fill";
    meterBar.appendChild(meterFill);
    meter.append(meterText, meterBar);

    const grid = document.createElement("div");
    grid.className = "item-grid";
    const feedback = document.createElement("p");
    feedback.className = "mini-feedback";
    feedback.textContent = "Escolha itens uteis sem passar do peso limite.";

    function selectedWeight() {
      return items.filter((item) => selected.has(item.name)).reduce((sum, item) => sum + item.weight, 0);
    }

    function updateMeter() {
      const weight = selectedWeight();
      meterText.textContent = `Peso ${weight}/${mission.weightLimit}`;
      meterFill.style.width = `${Math.min(100, (weight / mission.weightLimit) * 100)}%`;
      meterFill.style.background = weight > mission.weightLimit ? "#dd4d4d" : "";
    }

    items.forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "item-card";
      button.innerHTML = `<strong>${item.name}</strong><span>${item.weight} kg</span>`;
      button.addEventListener("click", () => {
        if (selected.has(item.name)) {
          selected.delete(item.name);
          button.classList.remove("selected");
        } else {
          selected.add(item.name);
          button.classList.add("selected");
        }
        updateMeter();
      });
      grid.appendChild(button);
    });

    const check = document.createElement("button");
    check.type = "button";
    check.textContent = "Conferir mochila";
    check.className = "wide-action";
    check.addEventListener("click", () => {
      const weight = selectedWeight();
      const selectedNames = Array.from(selected);
      const hasAllRequired = required.every((name) => selected.has(name));
      const hasWrong = items.some((item) => selected.has(item.name) && !item.good);
      if (weight > mission.weightLimit) {
        feedback.textContent = "A mochila ficou pesada demais. Tire algo que nao ajuda na trilha.";
        feedback.className = "mini-feedback bad";
        return;
      }
      if (!hasAllRequired) {
        feedback.textContent = "Faltou item importante: agua, lanterna, capa, Biblia ou lanche.";
        feedback.className = "mini-feedback bad";
        return;
      }
      if (hasWrong || selectedNames.length > required.length) {
        feedback.textContent = "Tem item desnecessario ocupando espaco. Revise a mochila.";
        feedback.className = "mini-feedback bad";
        return;
      }
      feedback.textContent = "Mochila pronta: leve, util e segura.";
      feedback.className = "mini-feedback good";
      completeMission(mission.id);
      setTimeout(() => ui.dialog.close(), 800);
    });

    updateMeter();
    ui.dialogBody.append(meter, grid, feedback, check);
  }

  function openRopeMission(mission) {
    showDialog(mission, "Mini-game de corda");
    const note = document.createElement("p");
    note.textContent = "Clique e arraste a corda passando pelos pontos na ordem iluminada.";
    const ropeWrap = document.createElement("div");
    ropeWrap.className = "rope-wrap";
    const ropeCanvas = document.createElement("canvas");
    ropeCanvas.width = 560;
    ropeCanvas.height = 260;
    ropeCanvas.className = "rope-canvas";
    ropeWrap.appendChild(ropeCanvas);
    const ropeCtx = ropeCanvas.getContext("2d");
    const points = [
      { x: 80, y: 135 },
      { x: 205, y: 75 },
      { x: 330, y: 178 },
      { x: 470, y: 112 },
    ].slice(0, mission.points.length);
    let current = 0;
    let drawing = false;
    const trail = [];

    function drawRope() {
      ropeCtx.clearRect(0, 0, ropeCanvas.width, ropeCanvas.height);
      ropeCtx.fillStyle = "#e7d7b6";
      ropeCtx.fillRect(0, 0, ropeCanvas.width, ropeCanvas.height);
      ropeCtx.strokeStyle = "rgba(38,51,79,0.16)";
      ropeCtx.lineWidth = 18;
      ropeCtx.lineCap = "round";
      ropeCtx.beginPath();
      ropeCtx.moveTo(72, 195);
      ropeCtx.bezierCurveTo(180, 35, 345, 238, 494, 58);
      ropeCtx.stroke();

      if (trail.length > 1) {
        ropeCtx.strokeStyle = "#c27c3c";
        ropeCtx.lineWidth = 12;
        ropeCtx.lineCap = "round";
        ropeCtx.lineJoin = "round";
        ropeCtx.beginPath();
        trail.forEach((p, index) => {
          if (index === 0) ropeCtx.moveTo(p.x, p.y);
          else ropeCtx.lineTo(p.x, p.y);
        });
        ropeCtx.stroke();
      }

      points.forEach((point, index) => {
        ropeCtx.fillStyle = index < current ? "#3f9e6d" : index === current ? "#f2b84b" : "#fffaf1";
        ropeCtx.strokeStyle = "#26334f";
        ropeCtx.lineWidth = 3;
        ropeCtx.beginPath();
        ropeCtx.arc(point.x, point.y, 22, 0, TAU);
        ropeCtx.fill();
        ropeCtx.stroke();
        ropeCtx.fillStyle = "#162033";
        ropeCtx.font = "900 12px Inter, system-ui";
        ropeCtx.textAlign = "center";
        ropeCtx.fillText(mission.points[index], point.x, point.y + 42);
      });
    }

    function canvasPos(event) {
      const rect = ropeCanvas.getBoundingClientRect();
      return {
        x: ((event.clientX - rect.left) / rect.width) * ropeCanvas.width,
        y: ((event.clientY - rect.top) / rect.height) * ropeCanvas.height,
      };
    }

    function checkPoint(pos) {
      const target = points[current];
      if (!target) return;
      if (distance(pos.x, pos.y, target.x, target.y) < 34) {
        current += 1;
        trail.push({ x: target.x, y: target.y });
        drawRope();
        if (current >= points.length) {
          completeMission(mission.id);
          setTimeout(() => ui.dialog.close(), 800);
        }
      }
    }

    ropeCanvas.addEventListener("pointerdown", (event) => {
      drawing = true;
      trail.length = 0;
      current = 0;
      const pos = canvasPos(event);
      trail.push(pos);
      checkPoint(pos);
      drawRope();
      ropeCanvas.setPointerCapture(event.pointerId);
    });
    ropeCanvas.addEventListener("pointermove", (event) => {
      if (!drawing) return;
      const pos = canvasPos(event);
      trail.push(pos);
      if (trail.length > 80) trail.shift();
      checkPoint(pos);
      drawRope();
    });
    ropeCanvas.addEventListener("pointerup", (event) => {
      drawing = false;
      try {
        ropeCanvas.releasePointerCapture(event.pointerId);
      } catch (error) {
        /* Pointer capture may already be gone. */
      }
      if (current < points.length) {
        trail.length = 0;
        current = 0;
        playSound("error");
        showToast("A corda escapou. Comece de novo pela Ponta.", 1.7);
        drawRope();
      }
    });

    drawRope();
    ui.dialogBody.append(note, ropeWrap);
  }

  function openTentMission(mission) {
    showDialog(mission, "Mini-game de barraca");
    const visual = document.createElement("div");
    visual.className = "tent-visual";
    const ground = document.createElement("div");
    ground.className = "tent-ground";
    visual.appendChild(ground);
    const parts = mission.steps.map((step, index) => {
      const part = document.createElement("button");
      part.type = "button";
      part.className = `tent-part tent-${index}`;
      part.textContent = step;
      visual.appendChild(part);
      return part;
    });
    const feedback = document.createElement("p");
    feedback.className = "mini-feedback";
    feedback.textContent = "Clique nas partes na ordem: lona, varetas, tecido, levantar, porta, nos e espeques.";
    let current = 0;

    function updateTent() {
      parts.forEach((part, index) => {
        part.classList.toggle("done", index < current);
        part.classList.toggle("current", index === current);
      });
    }

    parts.forEach((part, index) => {
      part.addEventListener("click", () => {
        if (index !== current) {
          feedback.textContent = `Ainda nao. Agora e a vez de: ${mission.steps[current]}.`;
          feedback.className = "mini-feedback bad";
          return;
        }
        current += 1;
        feedback.textContent = `${part.textContent} pronto.`;
        feedback.className = "mini-feedback good";
        updateTent();
        if (current >= mission.steps.length) {
          feedback.textContent = "Barraca firme, ventilada e bem presa.";
          completeMission(mission.id);
          setTimeout(() => ui.dialog.close(), 900);
        }
      });
    });

    updateTent();
    ui.dialogBody.append(visual, feedback);
  }

  function openMorseMission(mission) {
    showDialog(mission, "Mini-game de codigo Morse");
    const pattern = mission.pattern.replace(/\s+/g, " ").trim();
    const target = pattern.replace(/\s/g, "").split("");
    let index = 0;
    const board = document.createElement("div");
    board.className = "morse-board";
    const patternText = document.createElement("strong");
    patternText.textContent = pattern;
    const progress = document.createElement("div");
    progress.className = "morse-progress";
    target.forEach((symbol) => {
      const cell = document.createElement("span");
      cell.textContent = symbol === "." ? "curto" : "longo";
      progress.appendChild(cell);
    });
    const actions = document.createElement("div");
    actions.className = "morse-actions";
    const shortBtn = document.createElement("button");
    shortBtn.type = "button";
    shortBtn.textContent = "Curto";
    const longBtn = document.createElement("button");
    longBtn.type = "button";
    longBtn.textContent = "Longo";
    actions.append(shortBtn, longBtn);
    const feedback = document.createElement("p");
    feedback.className = "mini-feedback";
    feedback.textContent = "Leia o padrao e repita os sinais na ordem.";

    function press(symbol) {
      playSound(symbol === "." ? "click" : "plant");
      if (target[index] !== symbol) {
        playSound("error");
        feedback.textContent = "Sinal errado. Reiniciando transmissao.";
        feedback.className = "mini-feedback bad";
        index = 0;
        progress.querySelectorAll("span").forEach((cell) => cell.classList.remove("done"));
        return;
      }
      progress.children[index].classList.add("done");
      index += 1;
      feedback.textContent = `${index}/${target.length} sinais enviados.`;
      feedback.className = "mini-feedback good";
      if (index >= target.length) {
        completeMission(mission.id);
        setTimeout(() => ui.dialog.close(), 800);
      }
    }

    shortBtn.addEventListener("click", () => press("."));
    longBtn.addEventListener("click", () => press("-"));
    board.append(patternText, progress, actions, feedback);
    ui.dialogBody.append(board);
  }

  function openSafetyMission(mission) {
    showDialog(mission, "Mini-game de seguranca");
    const selected = new Set();
    const board = document.createElement("div");
    board.className = "safety-board";
    const extras = shuffle(["Pressa", "Cortar para o corpo", "Ir sozinho", "Brincar com ferramenta", "Improvisar sem avisar"]);
    const labels = shuffle([...mission.targets, ...extras.slice(0, Math.max(0, 8 - mission.targets.length))]);
    labels.forEach((label, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `safety-spot spot-${index}`;
      button.textContent = label;
      button.addEventListener("click", () => {
        if (mission.targets.includes(label)) {
          selected.add(label);
          button.classList.add("good");
          button.disabled = true;
          playSound("click");
          if (selected.size === mission.targets.length) {
            completeMission(mission.id);
            setTimeout(() => ui.dialog.close(), 800);
          }
        } else {
          button.classList.add("bad");
          button.disabled = true;
          playSound("error");
          showToast("Isso aumenta o risco. Escolha atitudes seguras.", 1.8);
        }
      });
      board.appendChild(button);
    });
    const hint = document.createElement("p");
    hint.className = "mini-feedback";
    hint.textContent = `Encontre ${mission.targets.length} atitudes seguras.`;
    ui.dialogBody.append(board, hint);
  }

  function openRapelMission(mission) {
    showDialog(mission, "Mini-game de rapel");
    let depth = 0;
    let speed = 0;
    let danger = 0;
    const wrap = document.createElement("div");
    wrap.className = "rapel-wrap";
    const climber = document.createElement("div");
    climber.className = "rapel-climber";
    const rope = document.createElement("div");
    rope.className = "rapel-rope";
    const controls = document.createElement("div");
    controls.className = "rapel-controls";
    const descend = document.createElement("button");
    descend.type = "button";
    descend.textContent = "Descer";
    const brake = document.createElement("button");
    brake.type = "button";
    brake.textContent = "Frear";
    controls.append(descend, brake);
    const feedback = document.createElement("p");
    feedback.className = "mini-feedback";
    feedback.textContent = "Use Descer e Frear. Mantenha a velocidade controlada.";
    wrap.append(rope, climber);

    function updateRapel(action) {
      if (action === "descend") {
        speed = clamp(speed + 1.05, 0, 6);
        depth = clamp(depth + 5.8 + speed, 0, 100);
      } else if (action === "brake") {
        speed = Math.max(0, speed - 2.2);
        depth = clamp(depth + 1.4, 0, 100);
      } else {
        speed = Math.max(0, speed - 0.2);
      }
      climber.style.top = `${16 + depth * 1.76}px`;
      if (speed > 4.8) {
        danger += 1;
        feedback.textContent = "Rapido demais. Use o freio.";
        feedback.className = "mini-feedback bad";
        playSound("error");
      } else {
        danger = Math.max(0, danger - 1);
        feedback.textContent = `Descida: ${Math.round(depth)}% | Controle: ${Math.max(0, 6 - Math.round(speed))}`;
        feedback.className = "mini-feedback";
      }
      if (danger >= 3) {
        depth = clamp(depth - 12, 0, 100);
        speed = 1.8;
        danger = 1;
        climber.style.top = `${16 + depth * 1.76}px`;
        feedback.textContent = "Pausa de seguranca: freio aplicado e descida corrigida.";
        feedback.className = "mini-feedback bad";
      }
      if (depth >= 100) {
        completeMission(mission.id);
        setTimeout(() => ui.dialog.close(), 800);
      }
    }

    descend.addEventListener("click", () => {
      playSound("click");
      updateRapel("descend");
    });
    brake.addEventListener("click", () => {
      playSound("plant");
      updateRapel("brake");
    });
    ui.dialogBody.append(wrap, controls, feedback);
    updateRapel();
  }

  function openCreationMission(mission) {
    showDialog(mission, "Mini-game da Criacao");
    let current = 0;
    const board = document.createElement("div");
    board.className = "creation-board";
    const dayList = document.createElement("div");
    dayList.className = "day-list";
    const choices = document.createElement("div");
    choices.className = "creation-choices";
    const feedback = document.createElement("p");
    feedback.className = "mini-feedback";

    function renderDays(message, tone) {
      dayList.innerHTML = "";
      mission.days.forEach((label, index) => {
        const item = document.createElement("span");
        item.textContent = `Dia ${index + 1}`;
        item.classList.toggle("done", index < current);
        item.classList.toggle("current", index === current);
        dayList.appendChild(item);
      });
      feedback.textContent = message || (current < mission.days.length ? `Escolha o que pertence ao Dia ${current + 1}.` : "Criacao revisada.");
      feedback.className = tone || "mini-feedback";
    }

    const buttons = shuffle(mission.days).map((label) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.addEventListener("click", () => {
        if (label === mission.days[current]) {
          button.classList.add("good");
          button.disabled = true;
          current += 1;
          playSound("click");
          renderDays();
          if (current >= mission.days.length) {
            completeMission(mission.id);
            setTimeout(() => ui.dialog.close(), 850);
          }
          return;
        }
        current = Math.max(0, current - 1);
        playSound("error");
        buttons.forEach((item) => {
          if (mission.days.indexOf(item.textContent) >= current) {
            item.disabled = false;
            item.classList.remove("good");
          }
        });
        renderDays("Revise com calma: esse dia nao combina. Volte um passo.", "mini-feedback bad");
      });
      choices.appendChild(button);
      return button;
    });

    board.append(dayList, choices);
    ui.dialogBody.append(board, feedback);
    renderDays();
  }

  function openLibraryMission(mission) {
    showDialog(mission, "Mini-game de biblioteca biblica");
    let current = 0;
    const shelf = document.createElement("div");
    shelf.className = "library-shelf";
    const feedback = document.createElement("p");
    feedback.className = "mini-feedback";
    const labels = shuffle([...mission.books, ...mission.extras]);

    function updateShelf() {
      feedback.textContent = `Procure agora: ${mission.books[current] || "estante completa"}.`;
    }

    labels.forEach((label) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.addEventListener("click", () => {
        if (label === mission.books[current]) {
          button.classList.add("good");
          button.disabled = true;
          current += 1;
          feedback.className = "mini-feedback good";
          playSound("click");
          updateShelf();
          if (current >= mission.books.length) {
            completeMission(mission.id);
            setTimeout(() => ui.dialog.close(), 850);
          }
          return;
        }
        feedback.textContent = "Livro fora da ordem. Encontre o proximo livro indicado.";
        feedback.className = "mini-feedback bad";
        button.classList.add("bad");
        playSound("error");
      });
      shelf.appendChild(button);
    });

    ui.dialogBody.append(shelf, feedback);
    updateShelf();
  }

  function openMatchMission(mission) {
    showDialog(mission, "Mini-game de associacao");
    let current = 0;
    const board = document.createElement("div");
    board.className = "match-board";
    const prompt = document.createElement("strong");
    const progress = document.createElement("div");
    progress.className = "progress-bar";
    const fill = document.createElement("span");
    fill.className = "progress-fill";
    progress.appendChild(fill);
    const answers = document.createElement("div");
    answers.className = "match-answers";
    const feedback = document.createElement("p");
    feedback.className = "mini-feedback";

    function renderMatch() {
      const pair = mission.pairs[current];
      prompt.textContent = pair ? pair.prompt : "Tudo associado.";
      fill.style.width = `${(current / mission.pairs.length) * 100}%`;
      feedback.textContent = `${current}/${mission.pairs.length} associacoes corretas.`;
      answers.querySelectorAll("button").forEach((button) => {
        button.disabled = false;
        button.classList.remove("bad");
      });
    }

    shuffle(mission.pairs.map((pair) => pair.answer)).forEach((answer) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = answer;
      button.addEventListener("click", () => {
        if (answer === mission.pairs[current].answer) {
          current += 1;
          feedback.className = "mini-feedback good";
          playSound("click");
          if (current >= mission.pairs.length) {
            fill.style.width = "100%";
            completeMission(mission.id);
            setTimeout(() => ui.dialog.close(), 850);
          } else {
            renderMatch();
          }
          return;
        }
        button.classList.add("bad");
        feedback.textContent = "Ainda nao. Pense no significado e tente outra associacao.";
        feedback.className = "mini-feedback bad";
        playSound("error");
      });
      answers.appendChild(button);
    });

    board.append(prompt, progress, answers, feedback);
    ui.dialogBody.append(board);
    renderMatch();
  }

  function openPlateMission(mission) {
    showDialog(mission, "Mini-game de saude");
    const items = [
      { name: "Agua", group: "Hidratacao", good: true },
      { name: "Frutas", group: "Vitaminas", good: true },
      { name: "Verduras", group: "Protecao", good: true },
      { name: "Graos integrais", group: "Energia", good: true },
      { name: "Feijao", group: "Forca", good: true },
      { name: "Refrigerante", group: "Trocar", good: false },
      { name: "Fritura pesada", group: "Excesso", good: false },
      { name: "Doce sem limite", group: "Excesso", good: false },
    ];
    const neededGroups = new Set(items.filter((item) => item.good).map((item) => item.group));
    const selected = new Set();
    const board = document.createElement("div");
    board.className = "plate-board";
    const feedback = document.createElement("p");
    feedback.className = "mini-feedback";
    feedback.textContent = "Escolha um item de cada grupo saudavel para montar o compromisso.";

    shuffle(items).forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "plate-card";
      button.innerHTML = `<strong>${item.name}</strong><span>${item.group}</span>`;
      button.addEventListener("click", () => {
        if (selected.has(item.name)) {
          selected.delete(item.name);
          button.classList.remove("selected");
        } else {
          selected.add(item.name);
          button.classList.add("selected");
        }
        playSound("click");
      });
      board.appendChild(button);
    });

    const check = document.createElement("button");
    check.type = "button";
    check.className = "wide-action";
    check.textContent = "Conferir compromisso";
    check.addEventListener("click", () => {
      const selectedItems = items.filter((item) => selected.has(item.name));
      const hasBad = selectedItems.some((item) => !item.good);
      const groups = new Set(selectedItems.map((item) => item.group));
      const hasAll = Array.from(neededGroups).every((group) => groups.has(group));
      if (hasBad || !hasAll || selectedItems.length !== neededGroups.size) {
        feedback.textContent = "O compromisso precisa ser equilibrado, simples e sem excessos.";
        feedback.className = "mini-feedback bad";
        playSound("error");
        return;
      }
      feedback.textContent = "Compromisso saudavel pronto para Daniel 1:8.";
      feedback.className = "mini-feedback good";
      completeMission(mission.id);
      setTimeout(() => ui.dialog.close(), 850);
    });

    ui.dialogBody.append(board, feedback, check);
  }

  function openFireMission(mission) {
    showDialog(mission, "Mini-game de fogueira");
    let current = 0;
    let heat = 8;
    const board = document.createElement("div");
    board.className = "fire-board";
    const pit = document.createElement("div");
    pit.className = "fire-pit";
    const flame = document.createElement("span");
    pit.appendChild(flame);
    const meter = document.createElement("div");
    meter.className = "progress-bar";
    const fill = document.createElement("span");
    fill.className = "progress-fill";
    meter.appendChild(fill);
    const choices = document.createElement("div");
    choices.className = "fire-choices";
    const feedback = document.createElement("p");
    feedback.className = "mini-feedback";
    const labels = shuffle([...mission.steps, "Folha verde", "Alcool", "Vento forte", "Papel molhado"]);

    function syncFire(message, tone) {
      heat = clamp(heat, 0, 100);
      fill.style.width = `${heat}%`;
      flame.style.transform = `translateX(-50%) scale(${0.55 + heat / 100})`;
      feedback.textContent = message || `Proximo passo: ${mission.steps[current] || "fogueira segura"}.`;
      feedback.className = tone || "mini-feedback";
      choices.querySelectorAll("button").forEach((button) => {
        const stepIndex = mission.steps.indexOf(button.textContent);
        button.disabled = stepIndex >= 0 && stepIndex < current;
        button.classList.toggle("good", stepIndex >= 0 && stepIndex < current);
      });
    }

    labels.forEach((label) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.addEventListener("click", () => {
        if (label === mission.steps[current]) {
          current += 1;
          heat += 16;
          feedback.className = "mini-feedback good";
          playSound("plant");
          syncFire();
          if (current >= mission.steps.length) {
            completeMission(mission.id);
            setTimeout(() => ui.dialog.close(), 950);
          }
          return;
        }
        current = Math.max(0, current - 1);
        heat -= 18;
        playSound("error");
        syncFire("Isso apaga ou deixa inseguro. Corrija a sequencia.", "mini-feedback bad");
      });
      choices.appendChild(button);
    });

    board.append(pit, meter, choices);
    ui.dialogBody.append(board, feedback);
    syncFire();
  }

  function openFieldIntro(mission) {
    showDialog(mission, "Missao no mapa");
    const station = stationMap[mission.station];
    const note = document.createElement("p");
    note.textContent =
      mission.kind === "plant"
        ? "Pressione E perto das areas brilhantes para plantar."
        : mission.kind === "delivery"
          ? "Pegue os pacotes brilhantes e leve ate a bandeira de entrega."
          : "Ande pelo mapa e colete os itens brilhantes.";
    ui.dialogBody.appendChild(note);
    ui.dialogPrimary.textContent = "Ir para o mapa";
    ui.dialogPrimary.onclick = () => {
      startFieldMission(mission, station);
      ui.dialog.close();
    };
  }

  function startFieldMission(mission, station) {
    state.field = {
      missionId: mission.id,
      kind: mission.kind,
      needed: mission.needed,
      count: 0,
      carried: false,
      items: [],
      plants: [],
      drop: { x: station.x + 110, y: station.y + 40 },
    };
    if (mission.kind === "collect") {
      for (let i = 0; i < mission.needed; i += 1) {
        state.field.items.push({
          x: clamp(station.x + between(-250, 250), 70, WORLD.w - 70),
          y: clamp(station.y + between(-190, 190), 70, WORLD.h - 70),
          taken: false,
        });
      }
      showToast(`Colete ${mission.needed} itens de ${mission.token}.`, 2.4);
    }
    if (mission.kind === "plant") {
      for (let i = 0; i < mission.needed; i += 1) {
        state.field.items.push({
          x: clamp(station.x + between(-220, 220), 70, WORLD.w - 70),
          y: clamp(station.y + between(-180, 180), 70, WORLD.h - 70),
          planted: false,
        });
      }
      showToast(`Plante ${mission.needed} mudas com a tecla E.`, 2.4);
    }
    if (mission.kind === "delivery") {
      for (let i = 0; i < mission.needed; i += 1) {
        state.field.items.push({
          x: clamp(station.x + between(-180, 180), 70, WORLD.w - 70),
          y: clamp(station.y + between(-150, 150), 70, WORLD.h - 70),
          taken: false,
          delivered: false,
        });
      }
      showToast(`Entregue ${mission.needed} itens para a bandeira.`, 2.4);
    }
  }

  function completeMission(id) {
    if (state.completed[id]) return;
    state.completed[id] = true;
    state.activeMissionId = null;
    state.selectedMissionId = null;
    state.field = null;
    playSound("done");
    showToast("Requisito concluido no cartao.", 2);
    evaluateStage();
    save();
    renderUi();
  }

  function evaluateStage() {
    const stageNow = currentStage();
    if (!stageNow.missions.every(isMissionDone)) return;
    if (state.awarded[stageNow.name]) return;

    state.awarded[stageNow.name] = true;
    playSound("pin");
    const isLast = state.stageIndex === stages.length - 1;
    if (isLast) {
      showToast("Voce completou todas as Classes dos Desbravadores!", 6);
      return;
    }

    const previousAge = stageNow.age;
    state.stageIndex += 1;
    const next = currentStage();
    player.x = stationMap.portal.x;
    player.y = stationMap.portal.y + 96;
    if (next.age > previousAge) {
      showToast(`PIN de ${stageNow.name} conquistado. Voce subiu para ${next.age} anos!`, 4.6);
    } else {
      showToast(`PIN de ${stageNow.name} conquistado. Classe avancada liberada!`, 4.2);
    }
  }

  function update(dt) {
    if (state.toastTime > 0) {
      state.toastTime -= dt;
      if (state.toastTime <= 0) ui.toast.classList.remove("show");
    }

    const input = getInput();
    const speed = 235;
    if (input.x || input.y) {
      player.vx += input.x * speed * 5 * dt;
      player.vy += input.y * speed * 5 * dt;
      player.dir = Math.atan2(input.y, input.x);
      player.step += dt * 9;
    }
    const mag = Math.hypot(player.vx, player.vy);
    if (mag > speed) {
      player.vx = (player.vx / mag) * speed;
      player.vy = (player.vy / mag) * speed;
    }
    player.x = clamp(player.x + player.vx * dt, 34, WORLD.w - 34);
    player.y = clamp(player.y + player.vy * dt, 34, WORLD.h - 34);
    player.vx *= Math.pow(0.05, dt);
    player.vy *= Math.pow(0.05, dt);

    updateFieldMission();
    updateNpcs(dt);
    updateCamera(dt);
  }

  function updateNpcs(dt) {
    for (const npc of mapDecor.npcs) {
      npc.t += dt * 0.9;
      const targetX = npc.homeX + Math.cos(npc.t * 0.9 + npc.r) * 62;
      const targetY = npc.homeY + Math.sin(npc.t * 0.7) * 44;
      npc.x += (targetX - npc.x) * dt * 1.2;
      npc.y += (targetY - npc.y) * dt * 1.2;
    }
  }

  function getInput() {
    let x = 0;
    let y = 0;
    if (keys.has("a") || keys.has("arrowleft")) x -= 1;
    if (keys.has("d") || keys.has("arrowright")) x += 1;
    if (keys.has("w") || keys.has("arrowup")) y -= 1;
    if (keys.has("s") || keys.has("arrowdown")) y += 1;
    const len = Math.hypot(x, y) || 1;
    return { x: x / len, y: y / len };
  }

  function updateFieldMission() {
    const field = state.field;
    if (!field) return;
    const mission = currentMissions().find((item) => item.id === field.missionId);
    if (!mission) return;

    if (field.kind === "collect") {
      for (const item of field.items) {
        if (!item.taken && distance(player.x, player.y, item.x, item.y) < 34) {
          item.taken = true;
          field.count += 1;
          showToast(`${field.count}/${field.needed} coletados.`, 1.1);
        }
      }
      if (field.count >= field.needed) completeMission(field.missionId);
    }

    if (field.kind === "delivery") {
      if (!field.carried) {
        const next = field.items.find((item) => !item.taken);
        if (next && distance(player.x, player.y, next.x, next.y) < 38) {
          next.taken = true;
          field.carried = true;
          showToast("Item pego. Leve ate a bandeira.", 1.7);
        }
      } else if (distance(player.x, player.y, field.drop.x, field.drop.y) < 48) {
        field.count += 1;
        field.carried = false;
        showToast(`${field.count}/${field.needed} entregues.`, 1.2);
      }
      if (field.count >= field.needed) completeMission(field.missionId);
    }
  }

  function tryPlant() {
    const field = state.field;
    if (!field || field.kind !== "plant") return false;
    const spot = field.items.find((item) => !item.planted && distance(player.x, player.y, item.x, item.y) < 58);
    if (!spot) {
      playSound("error");
      showToast("Chegue perto de uma area brilhante para plantar.", 1.6);
      return false;
    }
    spot.planted = true;
    field.plants.push({ x: spot.x, y: spot.y, age: 0 });
    field.count += 1;
    playSound("plant");
    showToast(`${field.count}/${field.needed} mudas plantadas.`, 1.2);
    if (field.count >= field.needed) completeMission(field.missionId);
    return true;
  }

  function updateCamera(dt) {
    const viewW = canvas.clientWidth;
    const viewH = canvas.clientHeight;
    const targetX = clamp(player.x - viewW * 0.5, 0, WORLD.w - viewW);
    const targetY = clamp(player.y - viewH * 0.5, 0, WORLD.h - viewH);
    camera.x += (targetX - camera.x) * (1 - Math.pow(0.002, dt));
    camera.y += (targetY - camera.y) * (1 - Math.pow(0.002, dt));
  }

  function nearestStation() {
    let best = null;
    let bestD = 92;
    for (const station of stations) {
      const d = distance(player.x, player.y, station.x, station.y);
      if (d < bestD) {
        best = station;
        bestD = d;
      }
    }
    return best;
  }

  function interact() {
    if (tryPlant()) return;
    const station = nearestStation();
    if (!station) {
      showToast("Aproxime-se de uma estacao ou escolha uma missao no cartao.", 1.9);
      return;
    }
    const mission = currentMissions().find((item) => item.station === station.id && !isMissionDone(item));
    if (mission) {
      openMission(mission.id);
      return;
    }
    showToast(`${station.name}: nada pendente nesta classe.`, 1.9);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctx.save();
    ctx.translate(-camera.x, -camera.y);
    drawGround();
    drawPaths();
    drawDecor();
    drawStations();
    drawNpcs();
    drawField();
    drawPlayer();
    ctx.restore();
    drawMapHud();
  }

  function drawGround() {
    const ground = ctx.createLinearGradient(0, 0, WORLD.w, WORLD.h);
    ground.addColorStop(0, "#a5d78f");
    ground.addColorStop(0.45, "#87ca7a");
    ground.addColorStop(1, "#75bfa1");
    ctx.fillStyle = ground;
    ctx.fillRect(0, 0, WORLD.w, WORLD.h);
    ctx.save();
    ctx.globalAlpha = 0.16;
    for (let y = -80; y < WORLD.h + 80; y += 88) {
      ctx.beginPath();
      for (let x = -40; x < WORLD.w + 60; x += 80) {
        const wave = Math.sin(x * 0.008 + y * 0.014) * 18;
        if (x === -40) ctx.moveTo(x, y + wave);
        else ctx.lineTo(x, y + wave);
      }
      ctx.lineWidth = 18;
      ctx.strokeStyle = y % 176 === 0 ? "#5eb980" : "#f1d06c";
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.12;
    for (let i = 0; i < 190; i += 1) {
      const x = (i * 137) % WORLD.w;
      const y = (i * 277) % WORLD.h;
      ctx.fillStyle = i % 3 === 0 ? "#fffaf1" : "#2f7d59";
      ctx.beginPath();
      ctx.ellipse(x, y, 4 + (i % 4), 1.7, i * 0.3, 0, TAU);
      ctx.fill();
    }
    ctx.restore();

    ctx.fillStyle = "#63bed3";
    ctx.beginPath();
    ctx.ellipse(1510, 905, 220, 105, -0.18, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.36)";
    ctx.lineWidth = 5;
    ctx.stroke();
  }

  function drawPaths() {
    ctx.save();
    ctx.strokeStyle = "rgba(85, 78, 54, 0.12)";
    ctx.lineWidth = 34;
    ctx.lineCap = "round";
    for (const path of mapDecor.paths) {
      ctx.beginPath();
      ctx.moveTo(path[0], path[1]);
      ctx.quadraticCurveTo((path[0] + path[2]) * 0.5, (path[1] + path[3]) * 0.5 + 30, path[2], path[3]);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(213, 180, 98, 0.34)";
    ctx.lineWidth = 18;
    for (const path of mapDecor.paths) {
      ctx.beginPath();
      ctx.moveTo(path[0], path[1]);
      ctx.quadraticCurveTo((path[0] + path[2]) * 0.5, (path[1] + path[3]) * 0.5 + 30, path[2], path[3]);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawDecor() {
    for (const flower of mapDecor.flowers) {
      ctx.fillStyle = flower.c;
      ctx.beginPath();
      ctx.arc(flower.x, flower.y, 3, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = "#317c55";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(flower.x, flower.y + 3);
      ctx.lineTo(flower.x, flower.y + 10);
      ctx.stroke();
    }

    for (const rock of mapDecor.rocks) {
      ctx.fillStyle = "#777f7f";
      ctx.beginPath();
      ctx.moveTo(rock.x - rock.r, rock.y + rock.r * 0.5);
      ctx.lineTo(rock.x - rock.r * 0.4, rock.y - rock.r);
      ctx.lineTo(rock.x + rock.r, rock.y - rock.r * 0.2);
      ctx.lineTo(rock.x + rock.r * 0.65, rock.y + rock.r * 0.7);
      ctx.closePath();
      ctx.fill();
    }

    for (const tent of mapDecor.tents) {
      ctx.fillStyle = "rgba(22,32,51,0.15)";
      ctx.beginPath();
      ctx.ellipse(tent.x, tent.y + 26, 55, 16, 0, 0, TAU);
      ctx.fill();
      ctx.fillStyle = tent.c;
      ctx.beginPath();
      ctx.moveTo(tent.x - 54, tent.y + 26);
      ctx.lineTo(tent.x, tent.y - 44);
      ctx.lineTo(tent.x + 54, tent.y + 26);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.36)";
      ctx.beginPath();
      ctx.moveTo(tent.x, tent.y - 36);
      ctx.lineTo(tent.x + 15, tent.y + 26);
      ctx.lineTo(tent.x - 4, tent.y + 26);
      ctx.closePath();
      ctx.fill();
    }

    drawCampDetails();

    for (const tree of mapDecor.trees) drawTree(tree.x, tree.y, tree.r, tree.c);
  }

  function drawCampDetails() {
    drawFlag(900, 545, "#dd4d4d");
    drawFlag(1018, 244, "#2f70b8");
    drawFlag(250, 555, "#f2b84b");
    drawBench(730, 735);
    drawBench(1060, 735);
    drawCampfire(885, 870);
  }

  function drawFlag(x, y, color) {
    ctx.fillStyle = "rgba(22,32,51,0.18)";
    ctx.beginPath();
    ctx.ellipse(x + 16, y + 60, 28, 8, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#6c5845";
    roundRect(x - 3, y, 6, 72, 3);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + 3, y + 4);
    ctx.lineTo(x + 58, y + 18);
    ctx.lineTo(x + 3, y + 32);
    ctx.closePath();
    ctx.fill();
  }

  function drawBench(x, y) {
    ctx.fillStyle = "rgba(22,32,51,0.14)";
    ctx.beginPath();
    ctx.ellipse(x, y + 22, 52, 10, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#8a603e";
    roundRect(x - 48, y, 96, 13, 6);
    ctx.fill();
    roundRect(x - 38, y + 18, 76, 10, 5);
    ctx.fill();
  }

  function drawCampfire(x, y) {
    ctx.fillStyle = "rgba(22,32,51,0.18)";
    ctx.beginPath();
    ctx.ellipse(x, y + 18, 48, 12, 0, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "#77533c";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x - 26, y + 20);
    ctx.lineTo(x + 26, y - 2);
    ctx.moveTo(x + 26, y + 20);
    ctx.lineTo(x - 26, y - 2);
    ctx.stroke();
    ctx.fillStyle = "#f2b84b";
    ctx.beginPath();
    ctx.moveTo(x, y - 38);
    ctx.quadraticCurveTo(x + 24, y - 4, x, y + 10);
    ctx.quadraticCurveTo(x - 24, y - 4, x, y - 38);
    ctx.fill();
    ctx.fillStyle = "#dd4d4d";
    ctx.beginPath();
    ctx.moveTo(x, y - 22);
    ctx.quadraticCurveTo(x + 14, y + 0, x, y + 10);
    ctx.quadraticCurveTo(x - 14, y + 0, x, y - 22);
    ctx.fill();
  }

  function drawTree(x, y, r, color) {
    ctx.fillStyle = "#77533c";
    roundRect(x - 6, y + r * 0.1, 12, r * 0.92, 5);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    ctx.beginPath();
    ctx.arc(x - r * 0.28, y - r * 0.26, r * 0.35, 0, TAU);
    ctx.fill();
  }

  function drawStations() {
    const stageNow = currentStage();
    const pendingStations = new Set(stageNow.missions.filter((mission) => !isMissionDone(mission)).map((mission) => mission.station));
    for (const station of stations) {
      const pending = pendingStations.has(station.id);
      const selected = state.selectedMissionId && currentMissions().find((mission) => mission.id === state.selectedMissionId)?.station === station.id;
      ctx.save();
      ctx.translate(station.x, station.y + Math.sin(performance.now() * 0.0018 + station.x * 0.01) * 2);
      ctx.fillStyle = "rgba(22,32,51,0.17)";
      ctx.beginPath();
      ctx.ellipse(0, 34, 46, 14, 0, 0, TAU);
      ctx.fill();

      if (pending || selected) {
        ctx.strokeStyle = selected ? "#ffffff" : station.color;
        ctx.lineWidth = selected ? 6 : 4;
        ctx.beginPath();
        ctx.arc(0, -2, 48 + Math.sin(performance.now() * 0.006) * 4, 0, TAU);
        ctx.stroke();
      }

      const grad = ctx.createLinearGradient(-34, -46, 34, 40);
      grad.addColorStop(0, "#fffaf1");
      grad.addColorStop(1, "#e8ecf2");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, -2, 38, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = station.color;
      ctx.lineWidth = 7;
      ctx.stroke();
      drawStationIcon(station);
      ctx.fillStyle = "#162033";
      ctx.font = "900 12px Inter, system-ui";
      ctx.textAlign = "center";
      const labelWidth = Math.max(86, ctx.measureText(station.name).width + 18);
      ctx.fillStyle = "rgba(255,250,241,0.92)";
      roundRect(-labelWidth / 2, 47, labelWidth, 25, 8);
      ctx.fill();
      ctx.fillStyle = "#162033";
      ctx.fillText(station.name, 0, 64);
      ctx.restore();
    }

    const near = nearestStation();
    if (near) {
      ctx.save();
      ctx.translate(near.x, near.y - 80);
      ctx.fillStyle = "rgba(22,32,51,0.86)";
      roundRect(-62, -19, 124, 34, 8);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 13px Inter, system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Espaco: interagir", 0, 3);
      ctx.restore();
    }
  }

  function drawStationIcon(station) {
    ctx.save();
    ctx.strokeStyle = station.color;
    ctx.fillStyle = station.color;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (station.id === "acampamento") {
      ctx.beginPath();
      ctx.moveTo(-21, 18);
      ctx.lineTo(0, -20);
      ctx.lineTo(23, 18);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -17);
      ctx.lineTo(6, 18);
      ctx.stroke();
    } else if (station.id === "natureza") {
      ctx.beginPath();
      ctx.ellipse(0, -2, 18, 27, 0.7, 0, TAU);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-10, 13);
      ctx.lineTo(13, -16);
      ctx.stroke();
    } else if (station.id === "nos") {
      ctx.beginPath();
      ctx.arc(-10, -2, 13, 0.2, TAU - 0.2);
      ctx.arc(12, -2, 13, Math.PI + 0.2, Math.PI - 0.2);
      ctx.stroke();
    } else if (station.id === "socorro") {
      roundRect(-18, -18, 36, 36, 8);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -11);
      ctx.lineTo(0, 11);
      ctx.moveTo(-11, 0);
      ctx.lineTo(11, 0);
      ctx.stroke();
    } else if (station.id === "mapa") {
      ctx.beginPath();
      ctx.arc(0, -2, 19, 0, TAU);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -22);
      ctx.lineTo(8, -2);
      ctx.lineTo(0, 18);
      ctx.lineTo(-8, -2);
      ctx.closePath();
      ctx.fill();
    } else if (station.id === "comunidade") {
      ctx.beginPath();
      ctx.moveTo(0, 18);
      ctx.bezierCurveTo(-32, -4, -15, -28, 0, -10);
      ctx.bezierCurveTo(15, -28, 32, -4, 0, 18);
      ctx.fill();
    } else if (station.id === "artes") {
      ctx.beginPath();
      ctx.moveTo(-17, 17);
      ctx.lineTo(17, -17);
      ctx.moveTo(-6, -20);
      ctx.lineTo(20, 6);
      ctx.stroke();
    } else if (station.id === "lideranca") {
      ctx.beginPath();
      ctx.arc(0, -10, 9, 0, TAU);
      ctx.moveTo(-18, 20);
      ctx.quadraticCurveTo(0, 3, 18, 20);
      ctx.stroke();
    } else if (station.id === "portal") {
      ctx.beginPath();
      ctx.moveTo(0, -25);
      ctx.lineTo(18, -2);
      ctx.lineTo(8, 24);
      ctx.lineTo(-10, 24);
      ctx.lineTo(-18, -2);
      ctx.closePath();
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(-18, -14);
      ctx.lineTo(18, -14);
      ctx.lineTo(0, 22);
      ctx.closePath();
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawField() {
    const field = state.field;
    if (!field) return;
    ctx.save();
    for (const item of field.items) {
      if (field.kind === "collect" && item.taken) continue;
      if (field.kind === "delivery" && item.taken) continue;
      if (field.kind === "plant" && item.planted) continue;
      ctx.strokeStyle = field.kind === "plant" ? "#3f9e6d" : "#f2b84b";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(item.x, item.y, 24 + Math.sin(performance.now() * 0.008) * 3, 0, TAU);
      ctx.stroke();
      ctx.fillStyle = field.kind === "plant" ? "rgba(63,158,109,0.28)" : "rgba(242,184,75,0.88)";
      ctx.beginPath();
      ctx.arc(item.x, item.y, field.kind === "delivery" ? 15 : 11, 0, TAU);
      ctx.fill();
    }

    if (field.kind === "delivery") {
      ctx.fillStyle = "#dd4d4d";
      ctx.fillRect(field.drop.x - 4, field.drop.y - 42, 8, 68);
      ctx.fillStyle = "#fffaf1";
      ctx.beginPath();
      ctx.moveTo(field.drop.x + 4, field.drop.y - 42);
      ctx.lineTo(field.drop.x + 64, field.drop.y - 27);
      ctx.lineTo(field.drop.x + 4, field.drop.y - 12);
      ctx.closePath();
      ctx.fill();
      if (field.carried) {
        ctx.fillStyle = "#f2b84b";
        roundRect(player.x - 13, player.y - 48, 26, 21, 5);
        ctx.fill();
      }
    }

    if (field.kind === "plant") {
      for (const plant of field.plants) {
        drawTree(plant.x, plant.y, 20, "#3f9e6d");
      }
    }
    ctx.restore();
  }

  function drawNpcs() {
    for (const npc of mapDecor.npcs) {
      ctx.save();
      ctx.translate(npc.x, npc.y + Math.sin(npc.t * 4) * 1.5);
      ctx.fillStyle = "rgba(22,32,51,0.16)";
      ctx.beginPath();
      ctx.ellipse(0, npc.r + 9, npc.r * 1.2, 5, 0, 0, TAU);
      ctx.fill();
      ctx.fillStyle = "#fffaf1";
      ctx.beginPath();
      ctx.arc(0, -npc.r * 0.55, npc.r * 0.82, 0, TAU);
      ctx.fill();
      ctx.fillStyle = npc.c;
      ctx.beginPath();
      ctx.arc(0, npc.r * 0.28, npc.r, 0, TAU);
      ctx.fill();
      ctx.fillStyle = "#26334f";
      ctx.beginPath();
      ctx.moveTo(-npc.r * 0.5, npc.r * 0.15);
      ctx.lineTo(0, npc.r * 0.74);
      ctx.lineTo(npc.r * 0.5, npc.r * 0.15);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#162033";
      ctx.beginPath();
      ctx.arc(-4, -npc.r * 0.63, 1.8, 0, TAU);
      ctx.arc(4, -npc.r * 0.63, 1.8, 0, TAU);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawPlayer() {
    ctx.save();
    ctx.translate(player.x, player.y);
    const bounce = Math.sin(player.step) * 2;
    ctx.fillStyle = "rgba(22,32,51,0.20)";
    ctx.beginPath();
    ctx.ellipse(0, 27, 25, 9, 0, 0, TAU);
    ctx.fill();
    ctx.translate(0, bounce);
    ctx.rotate(player.dir);

    ctx.fillStyle = "#26334f";
    ctx.beginPath();
    ctx.moveTo(-12, 15);
    ctx.lineTo(0, 30);
    ctx.lineTo(12, 15);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#fffaf1";
    ctx.beginPath();
    ctx.arc(0, 0, player.r, 0, TAU);
    ctx.fill();

    ctx.fillStyle = "#2f70b8";
    ctx.beginPath();
    ctx.arc(0, 0, player.r - 5, 0.35, TAU - 0.35);
    ctx.fill();

    ctx.fillStyle = "#dd4d4d";
    ctx.beginPath();
    ctx.moveTo(-10, 8);
    ctx.lineTo(0, 22);
    ctx.lineTo(10, 8);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#f2b84b";
    ctx.beginPath();
    ctx.moveTo(18, 0);
    ctx.lineTo(34, -7);
    ctx.lineTo(34, 7);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(22,32,51,0.22)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, player.r, 0, TAU);
    ctx.stroke();

    ctx.fillStyle = "#162033";
    ctx.beginPath();
    ctx.arc(8, -7, 3, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function drawMapHud() {
    const stageNow = currentStage();
    const field = state.field;
    ctx.save();
    ctx.fillStyle = "rgba(255,250,241,0.86)";
    roundRect(16, 16, 260, 82, 8);
    ctx.fill();
    ctx.fillStyle = "#162033";
    ctx.font = "900 18px Inter, system-ui";
    ctx.fillText(stageNow.name, 30, 44);
    ctx.fillStyle = "#637083";
    ctx.font = "800 13px Inter, system-ui";
    ctx.fillText(`Idade ${stageNow.age} anos`, 30, 67);
    if (field) {
      ctx.fillStyle = "#2f70b8";
      ctx.font = "900 13px Inter, system-ui";
      ctx.fillText(`Missao: ${field.count}/${field.needed}`, 30, 88);
    }
    ctx.restore();
  }

  function roundRect(x, y, w, h, r) {
    const rr = Math.min(r, w * 0.5, h * 0.5);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function frame(now) {
    const dt = Math.min(0.033, (now - lastTime) / 1000);
    lastTime = now;
    update(dt);
    draw();
    requestAnimationFrame(frame);
  }

  function bindEvents() {
    window.addEventListener("resize", resize);
    window.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();
      keys.add(key);
      if ([" ", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) event.preventDefault();
      if (key === " " || key === "enter") interact();
      if (key === "e" || key === "f") tryPlant();
    });
    window.addEventListener("keyup", (event) => keys.delete(event.key.toLowerCase()));
    canvas.addEventListener("pointermove", (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    });
    canvas.addEventListener("click", () => interact());
    ui.reset.addEventListener("click", resetGame);
    ui.sound.addEventListener("click", toggleSound);
    ui.storyNext.addEventListener("click", () => {
      playSound("click");
      if (state.storyIndex >= storySteps.length - 1) {
        closeStory();
      } else {
        state.storyIndex += 1;
        renderStory();
      }
    });
    ui.storySkip.addEventListener("click", () => {
      playSound("click");
      closeStory();
    });
    ui.touchInteract.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      interact();
    });
    document.querySelectorAll("[data-key]").forEach((button) => {
      const key = button.getAttribute("data-key");
      button.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        keys.add(key);
      });
      button.addEventListener("pointerup", () => keys.delete(key));
      button.addEventListener("pointerleave", () => keys.delete(key));
    });
  }

  generateDecor();
  load();
  resize();
  renderUi();
  renderStory();
  bindEvents();
  showToast("Bem-vindo ao Clube. Complete o cartao e conquiste seus PINs.", 3.2);
  requestAnimationFrame(frame);
})();
