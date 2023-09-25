#!/usr/bin/env node

// console.log(global);
// console.log(process.argv);
// console.log(process.env);
// console.log(process.env.NODE_ENV);

const note = process.argv.slice(2);
const newNote = {
  content: note,
  id: Date.now(),
};

console.log(newNote);
