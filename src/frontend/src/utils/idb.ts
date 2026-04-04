const DB_NAME = "writefy-offline";
const STORE = "scripts";

async function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE, { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function idbSaveScript(
  id: string,
  title: string,
  content: string,
): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).put({ id, title, content, savedAt: Date.now() });
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function idbGetScript(
  id: string,
): Promise<{ id: string; title: string; content: string } | null> {
  const db = await getDB();
  const tx = db.transaction(STORE, "readonly");
  const req = tx.objectStore(STORE).get(id);
  return new Promise((resolve) => {
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => resolve(null);
  });
}

export async function idbListScripts(): Promise<
  Array<{ id: string; title: string; content: string; savedAt: number }>
> {
  const db = await getDB();
  const tx = db.transaction(STORE, "readonly");
  const req = tx.objectStore(STORE).getAll();
  return new Promise((resolve) => {
    req.onsuccess = () => resolve(req.result ?? []);
    req.onerror = () => resolve([]);
  });
}

export async function idbDeleteScript(id: string): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).delete(id);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
