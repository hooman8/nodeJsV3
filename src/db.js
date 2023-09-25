import fs from "node:fs/promises";

const DB_PATH = new URL("../db.json", import.meta.url).pathname;

export const getDB = async () => {
  const db = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(db);
};

export const updateDB = async (id, updatedData) => {
  const db = await getDB();
  const noteIndex = db.notes.findIndex((note) => note.id === id);

  if (noteIndex === -1) {
    throw new Error("Note not found");
  }

  db.notes[noteIndex] = updatedData;
  await saveDB(db);
  return updatedData;
};

export const saveDB = async (db) => {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
  return db;
};

export const insert = async (data) => {
  const db = await getDB();
  db.notes.push(data);
  await saveDB(db);
  return data;
};
