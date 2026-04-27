const express = require("express");
const { createNote, bulkCreateNotes, getAllNotes, getNoteById, replaceNote, updateNote, deleteNote, bulkDeleteNotes, getNotesByCategory, getNotesByStatus, getNoteSummary, filterNotes } = require("../controllers/note.controller");

const router = express.Router();

router.post("/bulk", bulkCreateNotes);
router.post("/", createNote);
router.get("/", getAllNotes);
router.get("/category/:category", getNotesByCategory);
router.get("/status/:isPinned", getNotesByStatus);
router.get("/filter", filterNotes);
router.get("/:id/summary", getNoteSummary);
router.get("/:id", getNoteById);
router.put("/:id", replaceNote);
router.patch("/:id", updateNote);
router.delete("/bulk", bulkDeleteNotes);
router.delete("/:id", deleteNote);

module.exports = router;
