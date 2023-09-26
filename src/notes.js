import { insert, getDB, saveDB, updateDB } from "./db.js";
import { v4 as uuidv4 } from "uuid";
// const { v4: uuidv4 } = await import("uuid");
export const newNote = async (note, tags) => {
  const data = {
    tags,
    content: note,
    id: uuidv4(),
  };
  await insert(data);
  return data;
};
export const getAllNotes = async () => {
  const db = await getDB();
  return db.notes;
};

export const findNotes = async (filter) => {
  const notes = await getAllNotes();
  return notes.filter((note) =>
    note.content.toLowerCase().includes(filter.toLowerCase())
  );
};

export const updateNote = async (id, note) => {
  return await updateDB(id, note);
};

export const removeNote = async (id) => {
  const notes = await getAllNotes();
  const match = notes.find((note) => note.id === id);

  if (match) {
    const newNotes = notes.filter((note) => note.id !== id);
    await saveDB({ notes: newNotes });
    return id;
  }
};

export const removeAllNotes = async () => {
  await saveDB({ notes: [] });
};
