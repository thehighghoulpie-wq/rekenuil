'use strict';
/* =====================================================================
   Familie-stemmen: mama, papa of wela spreekt de Papiamentu-woordjes in.
   De opnames blijven op deze tablet (IndexedDB), nergens anders.
   Een 🔊-knopje verschijnt vanzelf bij elk woord dat is ingesproken.
   ===================================================================== */
const VOICE_KEYS = new Set();
let voiceDB = null;
function vdb() {
  if (voiceDB) return voiceDB;
  voiceDB = new Promise((res, rej) => {
    if (!window.indexedDB) return rej(new Error('geen opslag'));
    const r = indexedDB.open('toverschool-voice', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('clips');
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  });
  return voiceDB;
}
function vstore(mode, fn) {
  return vdb().then(db => new Promise((res, rej) => {
    const tx = db.transaction('clips', mode), st = tx.objectStore('clips'), req = fn(st);
    tx.oncomplete = () => res(req && req.result); tx.onerror = () => rej(tx.error);
  }));
}
const voiceGet = k => vstore('readonly', st => st.get(k));
const voiceAll = () => vstore('readonly', st => st.getAll());
const voicePut = (k, v) => vstore('readwrite', st => st.put(v, k)).then(() => { VOICE_KEYS.add(k); voiceRefresh(); });
const voiceDel = k => vstore('readwrite', st => st.delete(k)).then(() => { VOICE_KEYS.delete(k); voiceRefresh(); });
function voiceLoadKeys() {
  return vstore('readonly', st => st.getAllKeys()).then(keys => { (keys || []).forEach(k => VOICE_KEYS.add(k)); voiceRefresh(); }).catch(() => { });
}

// knopje in de tekst; blijft verborgen tot er een opname is
const voiceBtn = p => `<span class="vbtn" data-voice="${esc(p)}" role="button" tabindex="0" aria-label="${t('listen')}" hidden>🔊</span>`;
function voiceRefresh(root = document) { $$('[data-voice]', root).forEach(b => { b.hidden = !VOICE_KEYS.has(b.dataset.voice); }); }
new MutationObserver(ms => { for (const m of ms) for (const n of m.addedNodes) if (n.nodeType === 1) voiceRefresh(n); })
  .observe(document.body, { childList: true, subtree: true });

let voiceAudio = null;
function voicePlay(k) {
  return voiceGet(k).then(v => {
    if (!v) return;
    if (voiceAudio) { voiceAudio.pause(); URL.revokeObjectURL(voiceAudio.src); }
    voiceAudio = new Audio(URL.createObjectURL(v.blob)); voiceAudio.play().catch(() => { });
  });
}
// tik op 🔊: afspelen, en de kaart of knop eronder niet laten reageren
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('[data-voice]:not([data-rec])');
  if (!b) return;
  e.stopPropagation(); e.preventDefault();
  b.classList.remove('playing'); void b.offsetWidth; b.classList.add('playing');
  voicePlay(b.dataset.voice);
}, true);

/* ---------- opnemen (in de Ouderhoek) ---------- */
let voiceRec = null;
function voiceCanRecord() { return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder); }
function voiceStart() {
  if (voiceRec) return Promise.reject(new Error('al bezig'));
  return navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    const type = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'].find(t => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t));
    const rec = new MediaRecorder(stream, type ? { mimeType: type } : undefined), chunks = [];
    rec.ondataavailable = e => e.data.size && chunks.push(e.data);
    voiceRec = { rec, stream, chunks, done: new Promise(res => { rec.onstop = () => { stream.getTracks().forEach(t => t.stop()); res(new Blob(chunks, { type: rec.mimeType || type || 'audio/webm' })); }; }) };
    rec.start();
    voiceRec.timer = setTimeout(() => voiceStop(), 6000);   // woordjes zijn kort: na 6 seconden stopt hij vanzelf
    return voiceRec;
  });
}
function voiceStop() {
  if (!voiceRec) return Promise.resolve(null);
  const r = voiceRec; voiceRec = null; clearTimeout(r.timer);
  if (r.rec.state !== 'inactive') r.rec.stop();
  return r.done;
}

/* ---------- reservekopie ---------- */
const blobToB64 = b => new Promise(res => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.readAsDataURL(b); });
// alleen echte audio-data uit het bestand zelf; nooit iets van internet ophalen
const AUDIO_DATA = /^data:(audio\/[\w.+-]+)(?:;[\w.+=-]+)*;base64,([A-Za-z0-9+/=]+)$/;
function b64ToBlob(s) {
  const m = typeof s === 'string' && s.length < 3e6 && s.match(AUDIO_DATA);
  if (!m) return null;
  const bin = atob(m[2]), u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return new Blob([u], { type: m[1] });
}
function voiceExport() {
  return vstore('readonly', st => st.getAllKeys()).then(keys => Promise.all((keys || []).map(k => voiceGet(k).then(v => blobToB64(v.blob).then(d => ({ k, who: v.who, t: v.t, d })))))).catch(() => []);
}
function voiceImport(list) {
  if (!Array.isArray(list)) return Promise.resolve();
  const ok = list.filter(c => c && typeof c.k === 'string' && c.k.length <= 60).map(c => ({ k: c.k, blob: b64ToBlob(c.d) })).filter(c => c.blob);
  return Promise.all(ok.map(c => voicePut(c.k, { blob: c.blob, who: '', t: Date.now() })));
}

voiceLoadKeys();
