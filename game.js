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
      seq("am-voto", "Voto e Lei", "Monte a sequencia dos valores que guiam o Desbravador.", "voto", ["Honrar", "Ajudar", "Cuidar", "Crescer"]),
      backpack("am-mochila", "Mochila do Desbravador", "Monte uma mochila leve e util para uma reuniao com trilha curta.", "acampamento", 9),
      rope("am-nos", "No inicial", "Guie a corda pelos pontos certos para fechar o no.", "nos", ["Ponta", "Volta", "Laco", "Aperto"]),
      quiz("am-uniforme", "Preparar o uniforme", "Qual atitude combina com a investidura?", "conselheiro", "Cuidar do uniforme e respeitar o momento", ["Esconder o cartao", "Cuidar do uniforme e respeitar o momento", "Chegar sem estudar"]),
    ]),
    stage(10, "Amigo da Natureza", "AN", "#3f9e6d", [
      collect("an-folhas", "Trilha das folhas", "Colete 5 marcas de observacao pela trilha.", "natureza", "folha", 5),
      plant("an-plantar", "Jardim da unidade", "Plante 3 mudas ao redor do acampamento.", "natureza", 3),
      tent("an-barraca", "Barraca em equipe", "Monte a barraca na ordem correta antes da noite chegar.", "acampamento"),
    ]),
    stage(11, "Companheiro", "CP", "#dd4d4d", [
      seq("cp-voto", "Promessa em acao", "Organize uma atitude de companheirismo.", "voto", ["Ouvir", "Ajudar", "Animar", "Agradecer"]),
      delivery("cp-servico", "Missao comunitaria", "Leve 3 cestas ate a tenda de servico.", "comunidade", 3),
      quiz("cp-amigo", "Convidar um amigo", "Qual convite e mais acolhedor?", "comunidade", "Venha conhecer nossa unidade", ["Voce precisa ser perfeito", "Venha conhecer nossa unidade", "Fique longe da nossa equipe"]),
    ]),
    stage(11, "Companheiro de Excursionismo", "CE", "#c27c3c", [
      collect("ce-trilha", "Trilha com mochila", "Pegue 4 pontos de rota antes de voltar ao mapa.", "mapa", "rota", 4),
      backpack("ce-mochila", "Mochila esperta", "Prepare a mochila para uma pequena excursao, sem carregar peso inutil.", "acampamento", 10),
      quiz("ce-seguranca", "Regra de trilha", "Na caminhada, o grupo deve...", "mapa", "Ficar junto e avisar o conselheiro", ["Correr sozinho", "Ficar junto e avisar o conselheiro", "Sair da trilha por curiosidade"]),
    ]),
    stage(12, "Pesquisador", "PS", "#42b7ad", [
      collect("ps-pistas", "Campo de pesquisa", "Colete 5 pistas de plantas, pegadas e pedras.", "natureza", "pista", 5),
      quiz("ps-anotar", "Caderno de campo", "Como registrar uma descoberta?", "natureza", "Anotar local, data e observacao", ["So guardar na memoria", "Anotar local, data e observacao", "Chutar o nome"]),
      seq("ps-estudo", "Pesquisa em ordem", "Monte o metodo de pesquisa.", "artes", ["Observar", "Comparar", "Anotar", "Compartilhar"]),
    ]),
    stage(12, "Pesquisador de Campo e Bosque", "PB", "#3f9e6d", [
      collect("pb-bosque", "Bosque vivo", "Encontre 6 sinais de vida no bosque.", "natureza", "sinal", 6),
      plant("pb-restaurar", "Restaurar a clareira", "Plante 4 mudas para recuperar a clareira.", "natureza", 4),
      quiz("pb-respeito", "Cuidar do bosque", "O melhor explorador deixa...", "natureza", "O lugar melhor do que encontrou", ["Lixo escondido", "O lugar melhor do que encontrou", "Galhos quebrados por diversao"]),
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
      quiz("ex-clima", "Mudanca de tempo", "Se o tempo fecha rapido, a equipe deve...", "acampamento", "Procurar abrigo seguro e seguir orientacao", ["Continuar sem avaliar", "Procurar abrigo seguro e seguir orientacao", "Separar o grupo"]),
    ]),
    stage(14, "Excursionista na Mata", "EM", "#3f9e6d", [
      collect("em-trilha", "Sinais na mata", "Colete 6 sinais de trilha sem se afastar do grupo.", "natureza", "sinal", 6),
      plant("em-acampamento", "Acampamento leve", "Plante 4 marcas verdes para recuperar a area.", "acampamento", 4),
      quiz("em-fogueira", "Fogueira segura", "Depois da atividade, o fogo deve ficar...", "acampamento", "Totalmente apagado", ["Escondido com folhas", "Totalmente apagado", "Aceso para iluminar a noite toda"]),
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
  };

  let lastTime = performance.now();
  let seed = 45619;

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
  }

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      state.stageIndex = clamp(Number(saved.stageIndex) || 0, 0, stages.length - 1);
      state.completed = saved.completed || {};
      state.awarded = saved.awarded || {};
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
    player.x = 900;
    player.y = 650;
    save();
    renderUi();
    showToast("Novo jogo iniciado. Fale com o conselheiro ou escolha uma missao do cartao.", 3);
  }

  function showToast(text, seconds = 2.4) {
    ui.toast.textContent = text;
    ui.toast.classList.add("show");
    state.toastTime = seconds;
  }

  function renderUi() {
    const stageNow = currentStage();
    const doneCount = stageNow.missions.filter(isMissionDone).length;
    ui.age.textContent = stageNow.age;
    ui.className.textContent = stageNow.name;
    ui.progress.textContent = `${doneCount}/${stageNow.missions.length}`;

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
    const speed = 380;
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
    updateCamera(dt);
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
      showToast("Chegue perto de uma area brilhante para plantar.", 1.6);
      return false;
    }
    spot.planted = true;
    field.plants.push({ x: spot.x, y: spot.y, age: 0 });
    field.count += 1;
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
    drawField();
    drawPlayer();
    ctx.restore();
    drawMapHud();
  }

  function drawGround() {
    ctx.fillStyle = "#90cf82";
    ctx.fillRect(0, 0, WORLD.w, WORLD.h);
    ctx.save();
    ctx.globalAlpha = 0.18;
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
    ctx.strokeStyle = "rgba(139, 103, 59, 0.24)";
    ctx.lineWidth = 24;
    ctx.lineCap = "round";
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

    for (const tree of mapDecor.trees) drawTree(tree.x, tree.y, tree.r, tree.c);
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
      ctx.translate(station.x, station.y);
      ctx.fillStyle = "rgba(22,32,51,0.17)";
      ctx.beginPath();
      ctx.ellipse(0, 32, 48, 13, 0, 0, TAU);
      ctx.fill();

      if (pending || selected) {
        ctx.strokeStyle = selected ? "#ffffff" : station.color;
        ctx.lineWidth = selected ? 6 : 4;
        ctx.beginPath();
        ctx.arc(0, 0, 52 + Math.sin(performance.now() * 0.006) * 4, 0, TAU);
        ctx.stroke();
      }

      ctx.fillStyle = station.color;
      roundRect(-42, -34, 84, 68, 8);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.82)";
      ctx.beginPath();
      ctx.arc(0, -4, 18, 0, TAU);
      ctx.fill();
      ctx.fillStyle = station.color;
      ctx.fillRect(-20, 19, 40, 8);
      ctx.fillStyle = "#162033";
      ctx.font = "900 12px Inter, system-ui";
      ctx.textAlign = "center";
      ctx.fillText(station.name, 0, 55);
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

  function drawPlayer() {
    ctx.save();
    ctx.translate(player.x, player.y);
    const bounce = Math.sin(player.step) * 2;
    ctx.fillStyle = "rgba(22,32,51,0.18)";
    ctx.beginPath();
    ctx.ellipse(0, 24, 24, 8, 0, 0, TAU);
    ctx.fill();
    ctx.translate(0, bounce);
    ctx.rotate(player.dir);
    ctx.fillStyle = "#fffaf1";
    ctx.beginPath();
    ctx.arc(0, 0, player.r, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#2f70b8";
    ctx.beginPath();
    ctx.arc(0, 0, player.r - 5, 0.35, TAU - 0.35);
    ctx.fill();
    ctx.fillStyle = "#f2b84b";
    ctx.beginPath();
    ctx.moveTo(18, 0);
    ctx.lineTo(34, -7);
    ctx.lineTo(34, 7);
    ctx.closePath();
    ctx.fill();
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
  bindEvents();
  showToast("Bem-vindo ao Clube. Complete o cartao e conquiste seus PINs.", 3.2);
  requestAnimationFrame(frame);
})();
