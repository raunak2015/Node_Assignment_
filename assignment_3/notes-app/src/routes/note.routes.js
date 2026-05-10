const express = require("express");
const { createNote, bulkCreateNotes } = require("../controllers/note.controller");

const router = express.Router();

router.post("/bulk", bulkCreateNotes);
router.post("/", createNote);

module.exports = router;
