const DB_NAME = 'casaFamiliaVideos';
const STORE_NAME = 'v';

function openVideoDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    try {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        req.result.createObjectStore(STORE_NAME);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    } catch (err) {
      reject(err);
    }
  });
}

export async function loadCustomVideos(): Promise<Record<string, string>> {
  try {
    const db = await openVideoDb();
    return await new Promise((resolve) => {
      const req = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).openCursor();
      const result: Record<string, string> = {};
      req.onsuccess = () => {
        const cursor = req.result;
        if (cursor) {
          const blob = cursor.value as Blob;
          result[String(cursor.key)] = URL.createObjectURL(blob);
          cursor.continue();
        } else {
          resolve(result);
        }
      };
      req.onerror = () => resolve({});
    });
  } catch {
    return {};
  }
}
