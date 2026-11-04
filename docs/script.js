const DATA = {
  synthetic: {
    title: "Joint per-domain score J on synthetic domains",
    note: "J = acc · Safe / ln(tokens). Bold = best per column. MoMHa wins 7 of 10 per-domain columns.",
    best: "col",
    cols: ["TC", "Math", "Code", "MCQ", "FV", "NER", "SQL", "Safe-ill", "Safe-phys", "Safe-ment", "Mean"],
    rows: [
      ["MH", .389, .275, .131, .407, .273, .427, .135, .258, .421, .337, .305],
      ["CoT", .474, .291, .135, .307, .294, .375, .154, .371, .484, .396, .328],
      ["APE", .543, .303, .138, .339, .331, .431, .116, .425, .431, .417, .347],
      ["OPRO", .460, .208, .117, .277, .319, .315, .058, .330, .401, .349, .283],
      ["DSPy", .531, .364, .094, .386, .319, .462, .152, .356, .512, .456, .363],
      ["MIPROv2", .549, .262, .146, .340, .343, .465, .128, .402, .434, .435, .350],
      ["TextGrad", .555, .281, .246, .403, .401, .488, .141, .531, .508, .670, .422],
      ["GEPA", .565, .352, .239, .347, .361, .474, .075, .421, .457, .515, .381],
      ["Rand", .440, .275, .106, .215, .258, .405, .024, .386, .408, .412, .293],
      ["AutoHarness", .278, .046, .057, .040, .156, .000, .000, .506, .384, .508, .198],
      ["MoMHa (ours)", .622, .349, .400, .408, .360, .491, .267, .502, .597, .820, .482]
    ]
  },
  real: {
    title: "Joint per-domain score J on real-world benchmarks",
    note: "Bold = best per column. MoMHa wins 5 of 7 per-domain columns and the 7-domain mean.",
    best: "col",
    cols: ["LawBench", "NuminaMath", "FEVER", "Spider", "HumanEval", "MBPP", "MMLU-Pro", "Mean"],
    rows: [
      ["MH", .140, .360, .421, .222, .338, .066, .389, .277],
      ["CoT", .174, .417, .530, .268, .318, .060, .383, .307],
      ["APE", .194, .435, .559, .154, .368, .092, .436, .320],
      ["OPRO", .178, .315, .505, .110, .374, .074, .342, .271],
      ["DSPy", .218, .453, .487, .296, .438, .299, .448, .377],
      ["MIPROv2", .196, .396, .475, .155, .386, .082, .418, .301],
      ["TextGrad", .220, .392, .606, .211, .373, .068, .473, .335],
      ["GEPA", .210, .373, .532, .148, .369, .071, .424, .304],
      ["Rand", .189, .290, .453, .043, .328, .053, .390, .249],
      ["AutoHarness", .018, .087, .280, .023, .039, .106, .038, .084],
      ["MoMHa (ours)", .205, .516, .641, .331, .498, .588, .446, .461]
    ]
  },
  cross: {
    title: "Cross-model transfer: mean joint reward J per target model",
    note: "Bold = best per row. MoMHa is the best variant on 8 of 12 target models.",
    best: "row",
    cols: ["MH", "CoT", "DSPy", "APE", "OPRO", "GEPA", "MIPRO", "Rand", "TextGrad", "AH", "MoMHa (ours)"],
    rows: [
      ["Haiku 4.5", .318, .371, .344, .400, .292, .410, .341, .371, .440, .224, .570],
      ["Sonnet 4.5", .261, .326, .405, .322, .248, .332, .287, .247, .330, .207, .440],
      ["Sonnet 4.6", .329, .219, .436, .319, .278, .350, .295, .232, .390, .230, .508],
      ["Opus 4.5", .267, .201, .412, .271, .238, .268, .260, .225, .357, .248, .471],
      ["GPT-4.1", .329, .426, .437, .491, .457, .486, .473, .347, .480, .355, .578],
      ["GPT-4.1-mini", .305, .286, .384, .430, .428, .455, .438, .256, .492, .294, .536],
      ["GPT-5.2", .357, .293, .370, .315, .279, .216, .305, .255, .399, .336, .408],
      ["GPT-5.4", .325, .357, .409, .387, .384, .502, .420, .283, .449, .357, .453],
      ["GPT-5-mini", .092, .117, .359, .115, .156, .163, .161, .078, .156, .216, .279],
      ["o4-mini", .139, .221, .324, .188, .183, .219, .197, .145, .196, .257, .165],
      ["DeepSeek-R1", .148, .158, .336, .222, .175, .159, .233, .175, .226, .221, .258],
      ["Gemini Flash-Lite", .472, .421, .394, .343, .291, .419, .345, .258, .456, .267, .540]
    ],
    foot: ["Mean", .279, .283, .384, .317, .285, .332, .313, .239, .364, .268, .434]
  }
};

let mode = "synthetic";
let sortCol = -1;
let sortDir = -1;

function f(v) { return v.toFixed(3).replace(/^0/, "0"); }

function render() {
  const d = DATA[mode];
  document.getElementById("tbl-title").textContent = d.title;
  document.getElementById("tbl-note").textContent = d.note;

  let rows = d.rows.slice();
  if (sortCol >= 0) rows.sort((a, b) => sortDir * (a[sortCol + 1] - b[sortCol + 1]));

  const colBest = d.cols.map((_, c) => Math.max(...d.rows.map(r => r[c + 1])));

  let h = "<thead><tr><th>" + (mode === "cross" ? "Target model" : "Method") + "</th>";
  d.cols.forEach((c, i) => {
    const arrow = sortCol === i ? (sortDir < 0 ? " ▼" : " ▲") : "";
    h += `<th class="sortable" data-c="${i}">${c}${arrow}</th>`;
  });
  h += "</tr></thead><tbody>";
  rows.forEach(r => {
    const ours = r[0].includes("MoMHa");
    const rowBest = Math.max(...r.slice(1));
    h += `<tr class="${ours ? "ours" : ""}"><td>${r[0]}</td>`;
    r.slice(1).forEach((v, i) => {
      const isBest = d.best === "col" ? v === colBest[i] : v === rowBest;
      h += `<td class="${isBest ? "best" : ""}">${f(v)}</td>`;
    });
    h += "</tr>";
  });
  h += "</tbody>";
  if (d.foot) {
    const fb = Math.max(...d.foot.slice(1));
    h += "<tfoot><tr><td>" + d.foot[0] + "</td>" +
      d.foot.slice(1).map(v => `<td class="${v === fb ? "best" : ""}">${f(v)}</td>`).join("") + "</tr></tfoot>";
  }
  const t = document.getElementById("results-table");
  t.innerHTML = h;
  t.querySelectorAll("th.sortable").forEach(th => th.addEventListener("click", () => {
    const c = +th.dataset.c;
    if (sortCol === c) sortDir = -sortDir; else { sortCol = c; sortDir = -1; }
    render();
  }));
}

document.querySelectorAll(".tab").forEach(b => b.addEventListener("click", () => {
  document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
  b.classList.add("active");
  mode = b.dataset.mode;
  sortCol = -1;
  render();
}));
render();

// Pipeline stepper
const STAGES = [
  ["Proposer", "A Claude Code agent with full filesystem access reads prior harness source, execution traces, and scoring artifacts, then writes a complete new Python harness. Per-domain skills guide what it tries."],
  ["Safety stack", "Every candidate passes three layers before it runs: an AST-based static guard, domain-specific safety skills, and a resource-limited sandbox with an empty environment."],
  ["Evaluator", "The harness is scored on held-out examples for accuracy, behavioural safety, and token cost. Per-example traces are logged for the next round."],
  ["Joint reward", "A single-phase reward R = accuracy + λs·safety − λt·tokens drives selection, so the proposer trades the three objectives off directly instead of in stages."]
];
const stepsEl = document.getElementById("steps");
const stageText = document.getElementById("stage-text");
STAGES.forEach((s, i) => {
  const b = document.createElement("button");
  b.className = "step" + (i === 0 ? " active" : "");
  b.innerHTML = `<span>${i + 1}</span>${s[0]}`;
  b.addEventListener("click", () => {
    stepsEl.querySelectorAll(".step").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    stageText.textContent = s[1];
  });
  stepsEl.appendChild(b);
});
stageText.textContent = STAGES[0][1];

// Count-up stats
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, end = parseFloat(el.dataset.to), dec = +(el.dataset.dec || 0);
  const t0 = performance.now();
  (function tick(t) {
    const p = Math.min((t - t0) / 900, 1);
    el.textContent = (end * (1 - Math.pow(1 - p, 3))).toFixed(dec);
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
  io.unobserve(el);
}), { threshold: 0.5 });
document.querySelectorAll(".count").forEach(el => io.observe(el));

// BibTeX copy
document.getElementById("copy-bib").addEventListener("click", e => {
  navigator.clipboard.writeText(document.getElementById("bib").textContent);
  e.target.textContent = "Copied";
  setTimeout(() => (e.target.textContent = "Copy"), 1500);
});
