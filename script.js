const STATUS_OPTIONS = [
  { value: "unknown", label: "Unknown", color: "#94a3b8" },
  { value: "to-explore", label: "To explore", color: "#f59e0b" },
  { value: "like", label: "Like", color: "#3b82f6" },
  { value: "neutral", label: "Neutral", color: "#6b7280" },
  { value: "dislike", label: "Dislike", color: "#ef4444" },
  { value: "avoid", label: "Avoid", color: "#111827" }
];

const LINE_DATA = [
  {
    id: "northern",
    name: "Northern",
    color: "#111827",
    stations: [
      "hampstead",
      "belsize-park",
      "camden-town",
      "kings-cross",
      "bank",
      "london-bridge"
    ]
  },
  {
    id: "central",
    name: "Central",
    color: "#ef4444",
    stations: ["notting-hill", "oxford-circus", "bank", "liverpool-street", "stratford"]
  },
  {
    id: "jubilee",
    name: "Jubilee",
    color: "#374151",
    stations: ["baker-street", "bond-street", "waterloo", "canary-wharf"]
  },
  {
    id: "metropolitan",
    name: "Metropolitan",
    color: "#7c3aed",
    stations: ["paddington", "baker-street", "kings-cross", "finsbury-park"]
  }
];

const STATIONS = [
  { id: "hampstead", name: "Hampstead", x: 160, y: 120, lines: ["northern"], zone: "2" },
  { id: "belsize-park", name: "Belsize Park", x: 210, y: 170, lines: ["northern"], zone: "2" },
  {
    id: "camden-town",
    name: "Camden Town",
    x: 320,
    y: 210,
    lines: ["northern"],
    zone: "2",
    interchange: true
  },
  {
    id: "kings-cross",
    name: "King's Cross",
    x: 420,
    y: 270,
    lines: ["northern", "metropolitan"],
    zone: "1",
    interchange: true
  },
  {
    id: "bank",
    name: "Bank",
    x: 520,
    y: 380,
    lines: ["northern", "central"],
    zone: "1",
    interchange: true
  },
  { id: "london-bridge", name: "London Bridge", x: 560, y: 460, lines: ["northern"], zone: "1" },
  { id: "notting-hill", name: "Notting Hill", x: 150, y: 360, lines: ["central"], zone: "2" },
  {
    id: "oxford-circus",
    name: "Oxford Circus",
    x: 330,
    y: 350,
    lines: ["central"],
    zone: "1",
    interchange: true
  },
  {
    id: "liverpool-street",
    name: "Liverpool Street",
    x: 610,
    y: 340,
    lines: ["central"],
    zone: "1",
    interchange: true
  },
  { id: "stratford", name: "Stratford", x: 720, y: 320, lines: ["central"], zone: "2-3" },
  { id: "paddington", name: "Paddington", x: 140, y: 420, lines: ["metropolitan"], zone: "1" },
  {
    id: "baker-street",
    name: "Baker Street",
    x: 250,
    y: 310,
    lines: ["metropolitan", "jubilee"],
    zone: "1",
    interchange: true
  },
  {
    id: "bond-street",
    name: "Bond Street",
    x: 360,
    y: 330,
    lines: ["jubilee"],
    zone: "1"
  },
  {
    id: "waterloo",
    name: "Waterloo",
    x: 450,
    y: 430,
    lines: ["jubilee"],
    zone: "1",
    interchange: true
  },
  {
    id: "canary-wharf",
    name: "Canary Wharf",
    x: 720,
    y: 470,
    lines: ["jubilee"],
    zone: "2"
  },
  {
    id: "finsbury-park",
    name: "Finsbury Park",
    x: 520,
    y: 190,
    lines: ["metropolitan"],
    zone: "2"
  }
];

const NEIGHBOURHOODS = [
  {
    id: "camden",
    name: "Camden",
    stations: ["camden-town", "kings-cross", "baker-street"],
    color: "#fbbf24",
    label: { x: 320, y: 250 },
    blob: "M200 180 C260 130 360 140 400 220 C430 280 360 320 280 310 C220 300 180 240 200 180 Z"
  },
  {
    id: "shoreditch",
    name: "Shoreditch",
    stations: ["liverpool-street", "bank", "stratford"],
    color: "#22d3ee",
    label: { x: 620, y: 380 },
    blob: "M520 300 C600 250 700 280 740 360 C770 420 710 480 620 480 C540 470 500 400 520 300 Z"
  },
  {
    id: "maida-vale",
    name: "Maida Vale",
    stations: ["paddington", "baker-street", "notting-hill"],
    color: "#a7f3d0",
    label: { x: 200, y: 420 },
    blob: "M80 340 C140 300 260 300 300 360 C320 420 250 460 160 470 C100 460 60 400 80 340 Z"
  }
];

const DEFAULT_TAGS = ["parks", "nightlife", "schools", "riverside"];

const STORAGE_KEY = "zonein-state-v1";

const state = {
  stationMeta: {},
  neighbourhoodMeta: {},
  anchors: [{ id: "anchor-office", name: "Office", stationId: "kings-cross", threshold: 45 }],
  shortlist: { stations: [], neighbourhoods: [] }
};

let viewBox = { x: 0, y: 0, width: 900, height: 700 };
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let activeStationId = null;
let activeNeighbourhoodId = null;

const elements = {
  lineLayer: document.getElementById("lineLayer"),
  stationLayer: document.getElementById("stationLayer"),
  labelLayer: document.getElementById("labelLayer"),
  neighbourhoodLayer: document.getElementById("neighbourhoodLayer"),
  tooltip: document.getElementById("tooltip"),
  map: document.getElementById("tubeMap")
};

const searchInput = document.getElementById("searchInput");
const searchOptions = document.getElementById("searchOptions");
const stationPanel = document.getElementById("stationPanel");
const neighbourhoodPanel = document.getElementById("neighbourhoodPanel");
const panelEmpty = document.getElementById("panelEmpty");
const stationName = document.getElementById("stationName");
const stationLines = document.getElementById("stationLines");
const stationStatus = document.getElementById("stationStatus");
const stationRating = document.getElementById("stationRating");
const stationTags = document.getElementById("stationTags");
const stationNotes = document.getElementById("stationNotes");
const stationVisited = document.getElementById("stationVisited");
const toggleShortlist = document.getElementById("toggleShortlist");
const neighbourhoodName = document.getElementById("neighbourhoodName");
const neighbourhoodStations = document.getElementById("neighbourhoodStations");
const neighbourhoodStatus = document.getElementById("neighbourhoodStatus");
const neighbourhoodTags = document.getElementById("neighbourhoodTags");
const neighbourhoodNotes = document.getElementById("neighbourhoodNotes");
const commuteSummary = document.getElementById("commuteSummary");
const toggleNeighbourhoodShortlist = document.getElementById("toggleNeighbourhoodShortlist");
const shortlistItems = document.getElementById("shortlistItems");
const shortlistSort = document.getElementById("shortlistSort");
const shortlistTagFilter = document.getElementById("shortlistTagFilter");
const notesList = document.getElementById("notesList");
const notesSearch = document.getElementById("notesSearch");
const anchorList = document.getElementById("anchorList");
const anchorManager = document.getElementById("anchorManager");
const lineFilters = document.getElementById("lineFilters");
const statusFilters = document.getElementById("statusFilters");
const tagFilters = document.getElementById("tagFilters");
const interchangeFilter = document.getElementById("interchangeFilter");
const toggleNeighbourhoods = document.getElementById("toggleNeighbourhoods");
const toggleLineLabels = document.getElementById("toggleLineLabels");
const statusLegend = document.getElementById("statusLegend");
const clearFilters = document.getElementById("clearFilters");

const filters = {
  lines: new Set(),
  status: new Set(),
  tags: new Set(),
  interchangesOnly: false
};

const slugify = (value) => value.toLowerCase().replace(/\s+/g, "-");

const toTitleCase = (value) => value.replace(/\b\w/g, (match) => match.toUpperCase());

const loadState = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;
  try {
    const parsed = JSON.parse(saved);
    Object.assign(state, parsed);
  } catch (error) {
    console.warn("Failed to parse saved state", error);
  }
};

const saveState = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const getStationMeta = (stationId) => {
  if (!state.stationMeta[stationId]) {
    state.stationMeta[stationId] = {
      status: "unknown",
      rating: "",
      tags: [],
      notes: "",
      visited: "",
      updatedAt: new Date().toISOString()
    };
  }
  return state.stationMeta[stationId];
};

const getNeighbourhoodMeta = (neighbourhoodId) => {
  if (!state.neighbourhoodMeta[neighbourhoodId]) {
    state.neighbourhoodMeta[neighbourhoodId] = {
      status: "unknown",
      tags: [],
      notes: "",
      updatedAt: new Date().toISOString()
    };
  }
  return state.neighbourhoodMeta[neighbourhoodId];
};

const statusColor = (status) => STATUS_OPTIONS.find((option) => option.value === status)?.color || "#94a3b8";

const buildLegend = () => {
  statusLegend.innerHTML = "";
  STATUS_OPTIONS.forEach((option) => {
    const item = document.createElement("span");
    item.innerHTML = `<i style="color: ${option.color}"></i>${option.label}`;
    statusLegend.appendChild(item);
  });
};

const populateSelect = (select, includeEmpty = false) => {
  select.innerHTML = "";
  if (includeEmpty) {
    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "—";
    select.appendChild(emptyOption);
  }
  STATUS_OPTIONS.forEach((option) => {
    const optionEl = document.createElement("option");
    optionEl.value = option.value;
    optionEl.textContent = option.label;
    select.appendChild(optionEl);
  });
};

const buildSearchOptions = () => {
  searchOptions.innerHTML = "";
  [...STATIONS, ...NEIGHBOURHOODS].forEach((item) => {
    const option = document.createElement("option");
    option.value = item.name;
    searchOptions.appendChild(option);
  });
};

const buildFilters = () => {
  lineFilters.innerHTML = "";
  LINE_DATA.forEach((line) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = line.name;
    chip.style.borderColor = line.color;
    chip.addEventListener("click", () => {
      if (filters.lines.has(line.id)) {
        filters.lines.delete(line.id);
        chip.classList.remove("active");
      } else {
        filters.lines.add(line.id);
        chip.classList.add("active");
      }
      renderMap();
    });
    lineFilters.appendChild(chip);
  });

  statusFilters.innerHTML = "";
  STATUS_OPTIONS.forEach((status) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = status.label;
    chip.style.borderColor = status.color;
    chip.addEventListener("click", () => {
      if (filters.status.has(status.value)) {
        filters.status.delete(status.value);
        chip.classList.remove("active");
      } else {
        filters.status.add(status.value);
        chip.classList.add("active");
      }
      renderMap();
    });
    statusFilters.appendChild(chip);
  });

  tagFilters.innerHTML = "";
  DEFAULT_TAGS.forEach((tag) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = toTitleCase(tag);
    chip.addEventListener("click", () => {
      if (filters.tags.has(tag)) {
        filters.tags.delete(tag);
        chip.classList.remove("active");
      } else {
        filters.tags.add(tag);
        chip.classList.add("active");
      }
      renderMap();
    });
    tagFilters.appendChild(chip);
  });
};

const matchesFilters = (station) => {
  const meta = getStationMeta(station.id);
  if (filters.lines.size) {
    const hasLine = station.lines.some((line) => filters.lines.has(line));
    if (!hasLine) return false;
  }
  if (filters.status.size && !filters.status.has(meta.status)) {
    return false;
  }
  if (filters.tags.size) {
    const tagMatch = meta.tags.some((tag) => filters.tags.has(tag));
    if (!tagMatch) return false;
  }
  if (filters.interchangesOnly && !station.interchange) {
    return false;
  }
  return true;
};

const getStationById = (id) => STATIONS.find((station) => station.id === id);

const getNeighbourhoodById = (id) => NEIGHBOURHOODS.find((hood) => hood.id === id);

const createSvgElement = (tag, attrs = {}) => {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
};

const renderLines = () => {
  elements.lineLayer.innerHTML = "";
  elements.labelLayer.querySelectorAll(".line-label").forEach((label) => label.remove());

  LINE_DATA.forEach((line) => {
    const coords = line.stations.map((id) => {
      const station = getStationById(id);
      return station ? `${station.x},${station.y}` : "";
    });
    const pathData = `M ${coords.join(" L ")}`;

    const casing = createSvgElement("path", {
      d: pathData,
      class: "line-path line-casing",
      stroke: "#ffffff"
    });
    const linePath = createSvgElement("path", {
      d: pathData,
      class: "line-path",
      stroke: line.color
    });

    elements.lineLayer.appendChild(casing);
    elements.lineLayer.appendChild(linePath);

    if (toggleLineLabels.checked) {
      const midStation = getStationById(line.stations[Math.floor(line.stations.length / 2)]);
      if (midStation) {
        const label = createSvgElement("text", {
          x: midStation.x + 12,
          y: midStation.y - 12,
          class: "line-label"
        });
        label.textContent = line.name;
        elements.labelLayer.appendChild(label);
      }
    }
  });
};

const renderNeighbourhoods = () => {
  elements.neighbourhoodLayer.innerHTML = "";
  elements.labelLayer.querySelectorAll(".neighbourhood-label").forEach((label) => label.remove());

  if (!toggleNeighbourhoods.checked) return;

  NEIGHBOURHOODS.forEach((hood) => {
    const meta = getNeighbourhoodMeta(hood.id);
    const fill = statusColor(meta.status) || hood.color;

    const blob = createSvgElement("path", {
      d: hood.blob,
      fill,
      class: "neighbourhood"
    });
    blob.addEventListener("click", () => selectNeighbourhood(hood.id));
    elements.neighbourhoodLayer.appendChild(blob);

    const label = createSvgElement("text", {
      x: hood.label.x,
      y: hood.label.y,
      class: "neighbourhood-label"
    });
    label.textContent = hood.name;
    elements.labelLayer.appendChild(label);
  });
};

const renderStations = () => {
  elements.stationLayer.innerHTML = "";
  elements.labelLayer.querySelectorAll(".station-label").forEach((label) => label.remove());

  STATIONS.forEach((station) => {
    if (!matchesFilters(station)) return;
    const meta = getStationMeta(station.id);
    const group = createSvgElement("g", { "data-id": station.id, tabindex: 0 });

    const ring = createSvgElement("circle", {
      cx: station.x,
      cy: station.y,
      r: station.interchange ? 10 : 8,
      class: "station-ring",
      stroke: statusColor(meta.status)
    });

    const dot = createSvgElement("circle", {
      cx: station.x,
      cy: station.y,
      r: station.interchange ? 5 : 4,
      class: station.interchange ? "station-interchange" : "station-dot"
    });

    group.appendChild(ring);
    group.appendChild(dot);

    group.addEventListener("mouseenter", (event) => showTooltip(event, station));
    group.addEventListener("mouseleave", hideTooltip);
    group.addEventListener("click", () => selectStation(station.id));
    group.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectStation(station.id);
      }
    });

    elements.stationLayer.appendChild(group);

    const label = createSvgElement("text", {
      x: station.x + 10,
      y: station.y - 10,
      class: "station-label"
    });
    label.textContent = station.name;
    label.dataset.stationId = station.id;
    elements.labelLayer.appendChild(label);
  });
};

const updateLabelVisibility = () => {
  const zoomLevel = 900 / viewBox.width;
  const stationLabels = elements.labelLayer.querySelectorAll(".station-label");

  stationLabels.forEach((label) => {
    const station = getStationById(label.dataset.stationId);
    if (!station) return;

    if (zoomLevel < 0.8) {
      label.style.display = station.interchange ? "block" : "none";
    } else if (zoomLevel < 1.1) {
      label.style.display = station.interchange || station.zone === "1" ? "block" : "none";
    } else {
      label.style.display = "block";
    }
  });

  elements.labelLayer.querySelectorAll(".neighbourhood-label").forEach((label) => {
    label.style.display = zoomLevel < 0.6 ? "block" : "block";
  });
};

const renderMap = () => {
  renderNeighbourhoods();
  renderLines();
  renderStations();
  updateLabelVisibility();
};

const showTooltip = (event, station) => {
  const meta = getStationMeta(station.id);
  const lines = station.lines
    .map((lineId) => LINE_DATA.find((line) => line.id === lineId)?.name)
    .filter(Boolean)
    .join(", ");
  elements.tooltip.textContent = `${station.name} • ${lines} • ${toTitleCase(meta.status.replace("-", " "))}`;
  elements.tooltip.style.opacity = "1";
  const rect = elements.map.getBoundingClientRect();
  elements.tooltip.style.left = `${event.clientX - rect.left}px`;
  elements.tooltip.style.top = `${event.clientY - rect.top}px`;
};

const hideTooltip = () => {
  elements.tooltip.style.opacity = "0";
};

const selectStation = (stationId) => {
  activeNeighbourhoodId = null;
  activeStationId = stationId;
  const station = getStationById(stationId);
  if (!station) return;
  const meta = getStationMeta(stationId);

  panelEmpty.classList.add("hidden");
  neighbourhoodPanel.classList.add("hidden");
  stationPanel.classList.remove("hidden");

  stationName.textContent = station.name;
  stationLines.textContent = station.lines
    .map((lineId) => LINE_DATA.find((line) => line.id === lineId)?.name)
    .filter(Boolean)
    .join(" • ");
  stationStatus.value = meta.status;
  stationRating.value = meta.rating || "";
  stationTags.value = meta.tags.join(", ");
  stationNotes.value = meta.notes;
  stationVisited.value = meta.visited || "";

  updateShortlistButton();
};

const selectNeighbourhood = (neighbourhoodId) => {
  activeStationId = null;
  activeNeighbourhoodId = neighbourhoodId;
  const hood = getNeighbourhoodById(neighbourhoodId);
  if (!hood) return;
  const meta = getNeighbourhoodMeta(neighbourhoodId);

  panelEmpty.classList.add("hidden");
  stationPanel.classList.add("hidden");
  neighbourhoodPanel.classList.remove("hidden");

  neighbourhoodName.textContent = hood.name;
  neighbourhoodStations.textContent = `Stations: ${hood.stations
    .map((id) => getStationById(id)?.name)
    .filter(Boolean)
    .join(", ")}`;
  neighbourhoodStatus.value = meta.status;
  neighbourhoodTags.value = meta.tags.join(", ");
  neighbourhoodNotes.value = meta.notes;

  updateNeighbourhoodShortlistButton();
  renderCommuteSummary(hood);
};

const updateShortlistButton = () => {
  if (!activeStationId) return;
  const isInShortlist = state.shortlist.stations.includes(activeStationId);
  toggleShortlist.textContent = isInShortlist ? "Remove from shortlist" : "Add to shortlist";
};

const updateNeighbourhoodShortlistButton = () => {
  if (!activeNeighbourhoodId) return;
  const isInShortlist = state.shortlist.neighbourhoods.includes(activeNeighbourhoodId);
  toggleNeighbourhoodShortlist.textContent = isInShortlist
    ? "Remove from shortlist"
    : "Add neighbourhood to shortlist";
};

const updateStationMetaFromForm = () => {
  if (!activeStationId) return;
  const meta = getStationMeta(activeStationId);
  meta.status = stationStatus.value;
  meta.rating = stationRating.value;
  meta.tags = stationTags.value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  meta.notes = stationNotes.value.trim();
  meta.visited = stationVisited.value;
  meta.updatedAt = new Date().toISOString();
  saveState();
  renderMap();
  updateShortlist();
  updateNotes();
};

const updateNeighbourhoodMetaFromForm = () => {
  if (!activeNeighbourhoodId) return;
  const meta = getNeighbourhoodMeta(activeNeighbourhoodId);
  meta.status = neighbourhoodStatus.value;
  meta.tags = neighbourhoodTags.value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  meta.notes = neighbourhoodNotes.value.trim();
  meta.updatedAt = new Date().toISOString();
  saveState();
  renderMap();
  updateShortlist();
  updateNotes();
};

const hashString = (value) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const commuteTime = (anchorId, stationId) => {
  const seed = hashString(`${anchorId}-${stationId}`) % 25;
  return 18 + seed;
};

const renderCommuteSummary = (hood) => {
  const stationIds = hood.stations;
  const lines = state.anchors.map((anchor) => {
    const times = stationIds.map((stationId) => commuteTime(anchor.id, stationId)).sort((a, b) => a - b);
    const min = times[0];
    const median = times[Math.floor(times.length / 2)];
    return `${anchor.name}: ${min}–${median} min`;
  });
  commuteSummary.innerHTML = `<strong>Commute snapshot</strong><br>${lines.join("<br>")}`;
};

const updateShortlist = () => {
  const tagFilter = shortlistTagFilter.value.trim().toLowerCase();
  const items = [
    ...state.shortlist.stations.map((id) => ({ type: "station", id })),
    ...state.shortlist.neighbourhoods.map((id) => ({ type: "neighbourhood", id }))
  ];

  const enriched = items
    .map((item) => {
      if (item.type === "station") {
        const station = getStationById(item.id);
        const meta = getStationMeta(item.id);
        return {
          ...item,
          name: station?.name,
          rating: meta.rating,
          tags: meta.tags,
          commute: Math.min(...state.anchors.map((anchor) => commuteTime(anchor.id, item.id)))
        };
      }
      const hood = getNeighbourhoodById(item.id);
      const meta = getNeighbourhoodMeta(item.id);
      return {
        ...item,
        name: hood?.name,
        rating: "",
        tags: meta.tags,
        commute: Math.min(...hood.stations.map((stationId) => commuteTime(state.anchors[0]?.id || "", stationId)))
      };
    })
    .filter((item) => item.name);

  const filtered = enriched.filter((item) => {
    if (!tagFilter) return true;
    return item.tags.some((tag) => tag.toLowerCase().includes(tagFilter));
  });

  const sorted = [...filtered].sort((a, b) => {
    if (shortlistSort.value === "rating") {
      return (b.rating || 0) - (a.rating || 0);
    }
    if (shortlistSort.value === "commute") {
      return a.commute - b.commute;
    }
    return a.name.localeCompare(b.name);
  });

  shortlistItems.innerHTML = "";
  sorted.forEach((item) => {
    const card = document.createElement("div");
    card.className = "shortlist-item";
    card.innerHTML = `
      <h3>${item.name}</h3>
      <p class="muted">${item.type === "station" ? "Station" : "Neighbourhood"} • Commute ~${item.commute} min</p>
      <p class="muted">Tags: ${item.tags.join(", ") || "—"}</p>
    `;
    shortlistItems.appendChild(card);
  });
};

const updateNotes = () => {
  const query = notesSearch.value.trim().toLowerCase();
  const notes = [];

  Object.entries(state.stationMeta).forEach(([id, meta]) => {
    if (meta.notes) {
      notes.push({
        title: getStationById(id)?.name,
        text: meta.notes,
        type: "Station"
      });
    }
  });

  Object.entries(state.neighbourhoodMeta).forEach(([id, meta]) => {
    if (meta.notes) {
      notes.push({
        title: getNeighbourhoodById(id)?.name,
        text: meta.notes,
        type: "Neighbourhood"
      });
    }
  });

  const filtered = notes.filter((note) =>
    [note.title, note.text].some((value) => value?.toLowerCase().includes(query))
  );

  notesList.innerHTML = "";
  filtered.forEach((note) => {
    const card = document.createElement("div");
    card.className = "shortlist-item";
    card.innerHTML = `
      <strong>${note.title}</strong>
      <p class="muted">${note.type}</p>
      <p>${note.text}</p>
    `;
    notesList.appendChild(card);
  });
};

const renderAnchors = () => {
  anchorList.innerHTML = "";
  anchorManager.innerHTML = "";

  state.anchors.forEach((anchor) => {
    const row = document.createElement("div");
    row.className = "shortlist-item";
    row.innerHTML = `
      <label>
        Name
        <input type="text" value="${anchor.name}" data-anchor="${anchor.id}" data-field="name" />
      </label>
      <label>
        Station
        <select data-anchor="${anchor.id}" data-field="stationId"></select>
      </label>
      <label>
        Max commute (min)
        <input type="number" min="20" max="90" value="${anchor.threshold}" data-anchor="${anchor.id}" data-field="threshold" />
      </label>
      <button type="button" class="ghost" data-anchor-remove="${anchor.id}">Remove</button>
    `;

    const select = row.querySelector("select");
    STATIONS.forEach((station) => {
      const option = document.createElement("option");
      option.value = station.id;
      option.textContent = station.name;
      if (anchor.stationId === station.id) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    anchorManager.appendChild(row);

    const summary = document.createElement("div");
    summary.className = "shortlist-item";
    summary.innerHTML = `<strong>${anchor.name}</strong><p class="muted">Anchor at ${
      getStationById(anchor.stationId)?.name || "Map point"
    }</p>`;
    anchorList.appendChild(summary);
  });
};

const updateAnchorState = (event) => {
  const anchorId = event.target.dataset.anchor;
  if (!anchorId) return;
  const anchor = state.anchors.find((item) => item.id === anchorId);
  if (!anchor) return;
  anchor[event.target.dataset.field] = event.target.value;
  saveState();
  renderAnchors();
  updateShortlist();
};

const removeAnchor = (anchorId) => {
  state.anchors = state.anchors.filter((anchor) => anchor.id !== anchorId);
  saveState();
  renderAnchors();
  updateShortlist();
};

const addAnchor = () => {
  if (state.anchors.length >= 3) return;
  const newAnchor = {
    id: `anchor-${Date.now()}`,
    name: "New anchor",
    stationId: STATIONS[0].id,
    threshold: 45
  };
  state.anchors.push(newAnchor);
  saveState();
  renderAnchors();
  updateShortlist();
};

const handleShortlistToggle = () => {
  if (!activeStationId) return;
  const shortlist = state.shortlist.stations;
  if (shortlist.includes(activeStationId)) {
    state.shortlist.stations = shortlist.filter((id) => id !== activeStationId);
  } else {
    shortlist.push(activeStationId);
  }
  saveState();
  updateShortlistButton();
  updateShortlist();
};

const handleNeighbourhoodShortlistToggle = () => {
  if (!activeNeighbourhoodId) return;
  const shortlist = state.shortlist.neighbourhoods;
  if (shortlist.includes(activeNeighbourhoodId)) {
    state.shortlist.neighbourhoods = shortlist.filter((id) => id !== activeNeighbourhoodId);
  } else {
    shortlist.push(activeNeighbourhoodId);
  }
  saveState();
  updateNeighbourhoodShortlistButton();
  updateShortlist();
};

const handleSearch = () => {
  const value = searchInput.value.trim();
  if (!value) return;
  const station = STATIONS.find((item) => item.name.toLowerCase() === value.toLowerCase());
  if (station) {
    selectStation(station.id);
    return;
  }
  const hood = NEIGHBOURHOODS.find((item) => item.name.toLowerCase() === value.toLowerCase());
  if (hood) {
    selectNeighbourhood(hood.id);
  }
};

const setupTabs = () => {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((btn) => btn.classList.remove("active"));
      tab.classList.add("active");
      document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });
};

const setViewBox = () => {
  elements.map.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
  updateLabelVisibility();
};

const handleWheel = (event) => {
  event.preventDefault();
  const scaleFactor = event.deltaY > 0 ? 1.1 : 0.9;
  const newWidth = Math.min(1400, Math.max(450, viewBox.width * scaleFactor));
  const newHeight = (newWidth / 900) * 700;
  viewBox.x += (viewBox.width - newWidth) / 2;
  viewBox.y += (viewBox.height - newHeight) / 2;
  viewBox.width = newWidth;
  viewBox.height = newHeight;
  setViewBox();
};

const handlePointerDown = (event) => {
  isDragging = true;
  dragStart = { x: event.clientX, y: event.clientY };
};

const handlePointerMove = (event) => {
  if (!isDragging) return;
  const dx = ((event.clientX - dragStart.x) / elements.map.clientWidth) * viewBox.width;
  const dy = ((event.clientY - dragStart.y) / elements.map.clientHeight) * viewBox.height;
  viewBox.x -= dx;
  viewBox.y -= dy;
  dragStart = { x: event.clientX, y: event.clientY };
  setViewBox();
};

const handlePointerUp = () => {
  isDragging = false;
};

const setupExportImport = () => {
  document.getElementById("exportData").addEventListener("click", () => {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "zonein-data.json";
    link.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById("importData").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        Object.assign(state, parsed);
        saveState();
        renderAnchors();
        renderMap();
        updateShortlist();
        updateNotes();
      } catch (error) {
        console.warn("Invalid import file", error);
      }
    };
    reader.readAsText(file);
  });
};

const bindEvents = () => {
  stationStatus.addEventListener("change", updateStationMetaFromForm);
  stationRating.addEventListener("change", updateStationMetaFromForm);
  stationTags.addEventListener("input", updateStationMetaFromForm);
  stationNotes.addEventListener("input", updateStationMetaFromForm);
  stationVisited.addEventListener("change", updateStationMetaFromForm);
  toggleShortlist.addEventListener("click", handleShortlistToggle);

  neighbourhoodStatus.addEventListener("change", updateNeighbourhoodMetaFromForm);
  neighbourhoodTags.addEventListener("input", updateNeighbourhoodMetaFromForm);
  neighbourhoodNotes.addEventListener("input", updateNeighbourhoodMetaFromForm);
  toggleNeighbourhoodShortlist.addEventListener("click", handleNeighbourhoodShortlistToggle);

  searchInput.addEventListener("change", handleSearch);
  searchInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") handleSearch();
  });

  shortlistSort.addEventListener("change", updateShortlist);
  shortlistTagFilter.addEventListener("input", updateShortlist);
  notesSearch.addEventListener("input", updateNotes);

  anchorManager.addEventListener("input", updateAnchorState);
  anchorManager.addEventListener("change", updateAnchorState);
  anchorManager.addEventListener("click", (event) => {
    const anchorId = event.target.dataset.anchorRemove;
    if (anchorId) removeAnchor(anchorId);
  });
  document.getElementById("addAnchor").addEventListener("click", addAnchor);

  interchangeFilter.addEventListener("change", () => {
    filters.interchangesOnly = interchangeFilter.checked;
    renderMap();
  });

  clearFilters.addEventListener("click", () => {
    filters.lines.clear();
    filters.status.clear();
    filters.tags.clear();
    filters.interchangesOnly = false;
    interchangeFilter.checked = false;
    document.querySelectorAll(".chips .chip").forEach((chip) => chip.classList.remove("active"));
    renderMap();
  });

  toggleNeighbourhoods.addEventListener("change", renderMap);
  toggleLineLabels.addEventListener("change", renderMap);

  document.getElementById("zoomIn").addEventListener("click", () => {
    viewBox.width = Math.max(450, viewBox.width * 0.85);
    viewBox.height = (viewBox.width / 900) * 700;
    setViewBox();
  });
  document.getElementById("zoomOut").addEventListener("click", () => {
    viewBox.width = Math.min(1400, viewBox.width * 1.15);
    viewBox.height = (viewBox.width / 900) * 700;
    setViewBox();
  });
  document.getElementById("resetView").addEventListener("click", () => {
    viewBox = { x: 0, y: 0, width: 900, height: 700 };
    setViewBox();
  });

  elements.map.addEventListener("wheel", handleWheel, { passive: false });
  elements.map.addEventListener("pointerdown", handlePointerDown);
  window.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("pointerup", handlePointerUp);
};

const init = () => {
  loadState();
  populateSelect(stationStatus);
  populateSelect(neighbourhoodStatus);
  buildLegend();
  buildSearchOptions();
  buildFilters();
  renderAnchors();
  renderMap();
  updateShortlist();
  updateNotes();
  setupTabs();
  setupExportImport();
  bindEvents();
  setViewBox();
};

init();
