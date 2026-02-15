// scripts/migrate-to-feature-arch.js
// Run from client folder: node scripts/migrate-to-feature-arch.js

const fs = require("fs");
const path = require("path");
const child = require("child_process");

const cwd = process.cwd();
const srcRoot = path.join(cwd, "src");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function tryGitMv(src, dest) {
  try {
    child.execSync(`git mv "${src}" "${dest}"`, { stdio: "inherit" });
    return true;
  } catch (e) {
    // fallback
    try {
      ensureDir(path.dirname(dest));
      fs.renameSync(src, dest);
      console.log(`Renamed (fs): ${src} -> ${dest}`);
      return true;
    } catch (err) {
      console.warn(`Failed to move ${src} -> ${dest}: ${err.message}`);
      return false;
    }
  }
}

const moves = [
  // app
  ["App.jsx", "app/App.jsx"],
  ["main.jsx", "app/main.jsx"],
  ["layouts/AppLayout.jsx", "app/layouts/AppLayout.jsx"],

  // auth
  ["pages/Login.jsx", "features/auth/pages/Login.jsx"],
  ["context/AuthContext.jsx", "features/auth/auth.context.jsx"],

  // dashboard
  ["pages/Dashboard.jsx", "features/dashboard/pages/Dashboard.jsx"],
  [
    "components/dashboard/BodyHeatmap.jsx",
    "features/dashboard/components/BodyHeatmap/BodyHeatmap.jsx",
  ],
  [
    "components/dashboard/BodyHeatmapFront.jsx",
    "features/dashboard/components/BodyHeatmap/Front.jsx",
  ],
  [
    "components/dashboard/BodyHeatmapBack.jsx",
    "features/dashboard/components/BodyHeatmap/Back.jsx",
  ],
  [
    "components/dashboard/heatmapConfig.js",
    "features/dashboard/components/BodyHeatmap/config.js",
  ],
  [
    "components/dashboard/MuscleSetsChart.jsx",
    "features/dashboard/components/MuscleSetsChart.jsx",
  ],
  [
    "components/dashboard/TrainingLoadChart.jsx",
    "features/dashboard/components/TrainingLoadChart.jsx",
  ],
  [
    "components/dashboard/QuickStats.jsx",
    "features/dashboard/components/QuickStats.jsx",
  ],
  [
    "components/dashboard/GeminiInsightsPanel.jsx",
    "features/dashboard/components/GeminiInsightsPanel.jsx",
  ],
  [
    "components/dashboard/yearCalendar",
    "features/dashboard/components/YearCalendar",
  ],
  ["services/dashboardApi.js", "features/dashboard/services/dashboard.api.js"],

  // exercises
  ["pages/Exercises.jsx", "features/exercises/pages/Exercises.jsx"],
  ["components/exercises", "features/exercises/components"],
  ["services/exerciseApi.js", "features/exercises/services/exercise.api.js"],
  [
    "constants/exerciseOptions.js",
    "features/exercises/constants/exerciseOptions.js",
  ],

  // history
  ["pages/History.jsx", "features/history/pages/History.jsx"],
  ["components/history", "features/history/components"],
  ["services/historyApi.js", "features/history/services/history.api.js"],

  // routines
  ["pages/Routines.jsx", "features/routines/pages/Routines.jsx"],
  ["services/profileApi.js", "features/routines/services/routine.api.js"],

  // workouts
  ["pages/Workout.jsx", "features/workouts/pages/Workout.jsx"],
  ["pages/Workouts.jsx", "features/workouts/pages/Workouts.jsx"],

  // shared
  ["components/Sidebar.jsx", "shared/components/Sidebar.jsx"],
  ["components/Dropdown.jsx", "shared/components/Dropdown.jsx"],
  ["hooks", "shared/hooks"],
  ["utils", "shared/utils"],
  ["constants", "shared/constants"],
];

console.log("Creating target directories...");
[
  "app/layouts",
  "features/auth/pages",
  "features/auth/services",
  "features/dashboard/pages",
  "features/dashboard/components/BodyHeatmap",
  "features/dashboard/components/YearCalendar",
  "features/dashboard/services",
  "features/exercises/pages",
  "features/exercises/components",
  "features/exercises/services",
  "features/exercises/constants",
  "features/history/pages",
  "features/history/components",
  "features/history/services",
  "features/routines/pages",
  "features/routines/services",
  "features/workouts/pages",
  "shared/components",
  "shared/hooks",
  "shared/utils",
  "shared/constants",
  "shared/services",
].forEach((d) => ensureDir(path.join(srcRoot, d)));

console.log("Moving files with git mv (fallback to fs.rename)...");
const failedMoves = [];
for (const [fromRel, toRel] of moves) {
  const from = path.join(srcRoot, fromRel);
  const to = path.join(srcRoot, toRel);
  if (!fs.existsSync(from)) {
    // allow moving folders: check wildcard if directory missing but source may be file pattern
    // For directories that don't exist, warn
    console.warn(`Source not found: ${from}`);
    failedMoves.push({ from, to, reason: "not found" });
    continue;
  }
  ensureDir(path.dirname(to));
  const ok = tryGitMv(from, to);
  if (!ok) failedMoves.push({ from, to, reason: "move failed" });
}

if (failedMoves.length) {
  console.warn(
    "Some moves failed; inspect output. Failed moves count:",
    failedMoves.length,
  );
  failedMoves.forEach((m) => console.warn(m.from, "->", m.to, m.reason));
}

// Create shared http client file if missing
const httpPath = path.join(srcRoot, "shared/services/http.js");
if (!fs.existsSync(httpPath)) {
  const content = `import axios from "axios";

const baseURL =
  (typeof import.meta !== "undefined" && (import.meta.env?.VITE_API_BASE_URL || import.meta.env?.VITE_API_URL)) ||
  "http://localhost:5000/api";

const http = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default http;
`;
  ensureDir(path.dirname(httpPath));
  fs.writeFileSync(httpPath, content, "utf8");
  console.log("Wrote", httpPath);
} else {
  console.log("http client already exists at", httpPath);
}

// Create auth.api.js (auth helpers) if not present
const authApiPath = path.join(srcRoot, "features/auth/services/auth.api.js");
if (!fs.existsSync(authApiPath)) {
  const content = `import http from "../../../shared/services/http";

export async function register(payload) {
  const res = await http.post("/auth/register", payload);
  return res.data;
}

export async function login(payload) {
  const res = await http.post("/auth/login", payload);
  return res.data;
}

export async function logout() {
  const res = await http.post("/auth/logout");
  return res.data;
}
`;
  ensureDir(path.dirname(authApiPath));
  fs.writeFileSync(authApiPath, content, "utf8");
  console.log("Wrote", authApiPath);
} else {
  console.log("auth.api already exists at", authApiPath);
}

// Import adjustment: replace imports referencing old service/api and update moved-relative imports
console.log("Adjusting imports across src files...");
const glob = require("glob");

const moveMap = {};
moves.forEach(([oldRel, newRel]) => {
  const oldAbs = path.resolve(srcRoot, oldRel);
  const newAbs = path.resolve(srcRoot, newRel);
  moveMap[oldAbs] = newAbs;
});

// utility to convert to posix style
function pposix(x) {
  return x.split(path.sep).join("/");
}

const files = glob.sync("**/*.{js,jsx}", { cwd: srcRoot, nodir: true });

let updateCount = 0;

for (const f of files) {
  const abs = path.resolve(srcRoot, f);
  let content = fs.readFileSync(abs, "utf8");
  let updated = false;

  // 1) Replace imports that point to services/api (old shared file) -> shared/services/http
  const regexApi = /from\s+(['"])(\.+\/)*services\/api(\.js)?\1/g;
  if (regexApi.test(content)) {
    const importerDir = path.dirname(abs);
    const targetAbs = path.resolve(srcRoot, "shared/services/http.js");
    let rel = path.relative(importerDir, targetAbs);
    if (!rel.startsWith(".")) rel = "./" + rel;
    rel = pposix(rel).replace(/\.js$/, "");
    content = content.replace(regexApi, `from "${rel}"`);
    updated = true;
  }

  // 2) Rewrite relative imports that referenced moved files.
  // Find occurrences: from './...' or "../..."
  const importRegex = /from\s+(['"])(\.[^'"]+?)\1/g;
  content = content.replace(importRegex, (m, q, relPath) => {
    // try to determine original importer location (if this file itself was moved)
    // find original abs path if this file is a moved target
    const originalImporterAbs = Object.keys(moveMap).find(
      (oldAbs) => moveMap[oldAbs] === abs,
    );
    if (!originalImporterAbs) return m; // importer was not moved, can't reason reliably

    const resolvedOldImport = path.resolve(
      path.dirname(originalImporterAbs),
      relPath,
    );
    const newTargetAbs = moveMap[resolvedOldImport];
    if (!newTargetAbs) return m;

    let newRel = path.relative(path.dirname(abs), newTargetAbs);
    if (!newRel.startsWith(".")) newRel = "./" + newRel;
    newRel = pposix(newRel).replace(/\.js$/, "");
    updated = true;
    return `from ${q}${newRel}${q}`;
  });

  if (updated) {
    fs.writeFileSync(abs, content, "utf8");
    updateCount++;
    console.log("Updated imports in", f);
  }
}

console.log("Import adjustment complete. Files updated:", updateCount);

// Final scan for leftover references to "services/api" or old component paths
console.log(
  'Scanning for remaining references to "services/api" or old paths...',
);
const { execSync } = require("child_process");
function safeGrep(pattern) {
  try {
    const out = execSync(
      `grep -R --line-number --color=never "${pattern}" src || true`,
      { cwd },
    );
    return out.toString().trim();
  } catch (e) {
    return "";
  }
}

const leftovers = [];
const checkPatterns = [
  "services/api",
  "components/dashboard",
  "components/exercises",
  "components/history",
  "components/Sidebar.jsx",
  "components/Dropdown.jsx",
  "context/AuthContext.jsx",
];
checkPatterns.forEach((p) => {
  const r = safeGrep(p);
  if (r) leftovers.push({ pattern: p, result: r });
});

if (leftovers.length) {
  console.warn("Found possible leftover references (please inspect):");
  leftovers.forEach((l) => {
    console.warn("---", l.pattern);
    console.warn(l.result.split("\n").slice(0, 20).join("\n"));
    console.warn("---");
  });
} else {
  console.log("No obvious leftover references found for common patterns.");
}

console.log(
  "Migration script finished. Please run your dev server or build to verify:",
);
console.log("  cd", cwd);
console.log("  npm install");
console.log("  npm run dev   # or npm run build");
