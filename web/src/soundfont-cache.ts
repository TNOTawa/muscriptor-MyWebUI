/**
 * IndexedDB-backed SoundFont cache so the user doesn't have to re-select
 * a local .sf3 / .sf2 file every time they open the page.
 *
 * Single object-store layout:
 *   "soundfonts" — key: "active" → ArrayBuffer of the loaded SoundFont.
 */

const DB_NAME = "muscriptor-soundfonts";
const DB_VERSION = 1;
const STORE_NAME = "soundfonts";
const KEY = "active";

let _dbPromise: Promise<IDBDatabase> | null = null;

function open(): Promise<IDBDatabase> {
  if (_dbPromise) return _dbPromise;
  _dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => {
      console.error("IndexedDB open failed:", req.error);
      _dbPromise = null;
      reject(req.error);
    };
  });
  return _dbPromise;
}

export async function getCachedSoundFont(): Promise<ArrayBuffer | null> {
  let db: IDBDatabase;
  try {
    db = await open();
  } catch {
    return null;
  }
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(KEY);
    req.onsuccess = () => {
      const result = req.result ?? null;
      if (result) console.log("[SoundFont cache] hit (%d MB)", (result.byteLength / 1e6).toFixed(1));
      resolve(result);
    };
    req.onerror = () => {
      console.error("IndexedDB get failed:", req.error);
      resolve(null);
    };
  });
}

export async function putCachedSoundFont(buffer: ArrayBuffer): Promise<void> {
  let db: IDBDatabase;
  try {
    db = await open();
  } catch {
    return;
  }
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const req = tx.objectStore(STORE_NAME).put(buffer, KEY);
    req.onsuccess = () => {
      console.log("[SoundFont cache] stored (%d MB)", (buffer.byteLength / 1e6).toFixed(1));
      resolve();
    };
    req.onerror = () => {
      console.error("IndexedDB put failed:", req.error);
      resolve();
    };
  });
}
