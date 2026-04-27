const express = require("express");
const { createNote, bulkCreateNotes, getAllNotes } = require("../controllers/note.controller");

const router = express.Router();

router.post("/bulk", bulkCreateNotes);
router.post("/", createNote);
router.get("/", getAllNotes);

module.exports = router;
