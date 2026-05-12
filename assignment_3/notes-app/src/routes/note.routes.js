const express = require("express");
const { createNote, bulkCreateNotes, getAllNotes, getNoteById, replaceNote, updateNote, deleteNote, bulkDeleteNotes, searchNotesByTitle, searchNotesByContent } = require("../controllers/note.controller");

const router = express.Router();

router.post("/bulk", bulkCreateNotes);
router.post("/", createNote);
router.get("/", getAllNotes);
router.get("/search/content", searchNotesByContent);
router.get("/search", searchNotesByTitle);
router.get("/:id", getNoteById);
router.put("/:id", replaceNote);
router.patch("/:id", updateNote);
router.delete("/bulk", bulkDeleteNotes);
router.delete("/:id", deleteNote);

module.exports = router;
