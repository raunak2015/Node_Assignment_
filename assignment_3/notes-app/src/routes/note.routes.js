const express = require("express");
const { createNote, bulkCreateNotes, getAllNotes, getNoteById, replaceNote, updateNote, deleteNote, bulkDeleteNotes, searchNotesByTitle, searchNotesByContent, searchAllNotes, filterSortNotes, filterPaginateNotes, sortPaginateNotes, searchFilterNotes, searchSortPaginateNotes, filterSortPaginateNotes, queryNotes } = require("../controllers/note.controller");

const router = express.Router();

router.post("/bulk", bulkCreateNotes);
router.post("/", createNote);
router.get("/", getAllNotes);
router.get("/search/all", searchAllNotes);
router.get("/search/content", searchNotesByContent);
router.get("/search", searchNotesByTitle);
router.get("/filter-sort", filterSortNotes);
router.get("/filter-paginate", filterPaginateNotes);
router.get("/sort-paginate", sortPaginateNotes);
router.get("/search-filter", searchFilterNotes);
router.get("/search-sort-paginate", searchSortPaginateNotes);
router.get("/filter-sort-paginate", filterSortPaginateNotes);
router.get("/query", queryNotes);
router.get("/:id", getNoteById);
router.put("/:id", replaceNote);
router.patch("/:id", updateNote);
router.delete("/bulk", bulkDeleteNotes);
router.delete("/:id", deleteNote);

module.exports = router;
