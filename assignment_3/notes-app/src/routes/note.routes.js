const express = require("express");
const { createNote, bulkCreateNotes, getAllNotes, getNoteById, replaceNote, updateNote } = require("../controllers/note.controller");

const router = express.Router();

router.post("/bulk", bulkCreateNotes);
router.post("/", createNote);
router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.put("/:id", replaceNote);
router.patch("/:id", updateNote);

module.exports = router;
