import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getDatabase, ref, onValue, set, push, remove, runTransaction,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- DOM ---
const clockEl = document.getElementById("clock");
const startBtn = document.getElementById("btn-start");
const stopBtn = document.getElementById("btn-stop");
const resetBtn = document.getElementById("btn-reset");
const lapList = document.getElementById("lap-list");
const lapEmpty = document.getElementById("lap-empty");
const statusEl = document.getElementById("status");

// --- Zustand ---
let startTime = null;   // Serverzeit des Starts (ms)
let offset = 0;         // Unterschied lokale Uhr zu Serverzeit (ms)
let laps = [];          // [{ n, elapsed }]

function setStatus(text) { statusEl.textContent = text; }

function formatMs(ms) {
  const total = Math.max(0, Math.floor(ms));
  const min = Math.floor(total / 60000);
  const sec = Math.floor((total % 60000) / 1000);
  const tenth = Math.floor((total % 1000) / 100);
  return String(min).padStart(2, "0") + ":" + String(sec).padStart(2, "0") + "," + tenth;
}

function serverNow() { return Date.now() + offset; }

function render() {
  const running = startTime !== null;
  startBtn.disabled = running;
  stopBtn.disabled = !running;
  clockEl.classList.toggle("running", running);

  lapEmpty.style.display = laps.length ? "none" : "block";
  lapList.innerHTML = "";
  for (const lap of laps) {
    const li = document.createElement("li");
    const n = document.createElement("span");
    n.className = "n";
    n.textContent = "Runde " + String(lap.n).padStart(2, "0");
    const t = document.createElement("span");
    t.textContent = formatMs(lap.elapsed);
    li.append(n, t);
    lapList.append(li);
  }
}

function tick() {
  if (startTime !== null) clockEl.textContent = formatMs(serverNow() - startTime);
  else clockEl.textContent = "00:00,0";
}

// --- Firebase: Sync ---
// Uhrzeit-Offset zur Serverzeit messen
onValue(ref(db, ".info/serverTimeOffset"), (snap) => { offset = snap.val() || 0; });

onValue(ref(db, "state/startTime"), (snap) => {
  startTime = snap.val() ?? null;
  render();
  if (startTime === null) tick();
});

onValue(ref(db, "laps"), (snap) => {
  const val = snap.val() ?? {};
  laps = Object.values(val).sort((a, b) => a.n - b.n);
  render();
});

// --- Aktionen ---
startBtn.addEventListener("click", async () => {
  try {
    await runTransaction(ref(db, "state/startTime"), (current) => current ?? serverTimestamp());
  } catch (e) {
    setStatus("Start fehlgeschlagen: " + e.message);
  }
});

stopBtn.addEventListener("click", async () => {
  if (startTime === null) return;
  try {
    // Laufende Rundennummer atomar ziehen, damit bei 40-50 Leuten
    // keine Nummer doppelt vergeben wird.
    const counter = await runTransaction(ref(db, "state/lapCount"), (current) => (current ?? 0) + 1);
    const n = counter.snapshot.val();
    const elapsed = serverNow() - startTime;
    await push(ref(db, "laps"), { n, elapsed, at: serverTimestamp() });
    setStatus("Runde " + n + " gestoppt: " + formatMs(elapsed));
  } catch (e) {
    setStatus("Stopp fehlgeschlagen: " + e.message);
  }
});

resetBtn.addEventListener("click", async () => {
  try {
    await set(ref(db, "state"), { startTime: null, lapCount: 0 });
    await remove(ref(db, "laps"));
    setStatus("");
  } catch (e) {
    setStatus("Zur\u00fccksetzen fehlgeschlagen: " + e.message);
  }
});

setInterval(tick, 100);
tick();
