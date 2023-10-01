import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  newNote,
  getAllNotes,
  findNotes,
  updateNote,
  removeNote,
  removeAllNotes,
} from "./notes.js";
import { start } from "../server.js";

const listNotes = async () => {
  const notes = await getAllNotes();
  notes.forEach(({ id, content, tags }) => {
    console.log(`Note ${id}: ${content} Tags: ${tags}`);
    console.log("\n");
  });
};

yargs(hideBin(process.argv))
  .command(
    "new <note>",
    "create a new note",
    (yargs) => {
      return yargs.positional("note", {
        describe: "The content of the note you want to create",
        type: "string",
      });
    },
    async (argv) => {
      const tags = argv.tags ? argv.tags.split(",") : [];
      const note = await newNote(argv.note, tags);
      console.log(note);
    }
  )
  .option("tags", {
    alias: "t",
    type: "string",
    description: "tags to add to the note",
  })
  .command(
    "all",
    "get all notes",
    () => {},
    async (argv) => {
      const notes = await getAllNotes();
      listNotes(notes);
    }
  )
  .command(
    "find <filter>",
    "get matching notes",
    (yargs) => {
      return yargs.positional("filter", {
        describe:
          "The search term to filter notes by, will be applied to note.content",
        type: "string",
      });
    },
    async (argv) => {
      const notes = await getAllNotes();
      const filteredNotes = await findNotes(argv.filter);
      listNotes(filteredNotes);
    }
  )
  .command(
    "remove <id>",
    "remove a note by id",
    (yargs) => {
      return yargs.positional("id", {
        type: "string",
        description: "The id of the note you want to remove",
      });
    },
    async (argv) => {
      const id = await removeNote(argv.id);
      console.log(`Note ${id} removed`);
    }
  )
  .command(
    "update <id> <note> [tags]",
    "update a note by id",
    (yargs) => {
      return yargs
        .positional("id", {
          type: "string",
          description: "The id of the note you want to update",
        })
        .positional("note", {
          type: "string",
          description: "The new note content",
        })
        .positional("tags", {
          type: "string",
          description: "The new tags for the note, comma-separated (optional)",
          default: "",
        });
    },
    async (argv) => {
      const tagsArray = argv.tags ? argv.tags.split(",") : [];
      const updatedNote = await updateNote(argv.id, {
        id: argv.id,
        content: argv.note,
        tags: tagsArray,
      });
      console.log(
        `Note ${updatedNote.id} updated with new content ${
          updatedNote.content
        }${argv.tags ? " and tags" : ""}`
      );
    }
  )
  .command(
    "web [port]",
    "launch website to see notes",
    (yargs) => {
      return yargs.positional("port", {
        describe: "port to bind on",
        default: 5000,
        type: "number",
      });
    },
    async (argv) => {
      const notes = await getAllNotes();
      start(notes, argv.port);
    }
  )
  .command(
    "clean",
    "remove all notes",
    () => {},
    async (argv) => {
      await removeAllNotes();
      console.log("All notes removed");
    }
  )
  .demandCommand(1)
  .parse();
