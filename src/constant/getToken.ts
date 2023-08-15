import { openDB } from 'idb';

export default async function getToken() {
  const db = await openDB('db', 1);
  const transaction = db.transaction(['store'], 'readonly');
  const store = transaction.objectStore('store');
  const value = await store.get('t');

  return value;
}
