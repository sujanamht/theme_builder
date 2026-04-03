import { openDB as idbOpenDB } from 'idb'

const DB_NAME = 'theme-builder'
const DB_VERSION = 1
const STORE_NAME = 'state'

function openDB() {
  return idbOpenDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME)
    },
  })
}

export async function saveState(theme) {
  const db = await openDB()
  await db.put(STORE_NAME, theme, 'theme')
}

export async function loadState() {
  const db = await openDB()
  const result = await db.get(STORE_NAME, 'theme')
  return result ?? null
}
