const Note = require("../models/note.model");
const mongoose = require("mongoose");

// 1. Create a note (POST /api/notes)
const createNote = async (req, res) => {
  const { title, content, category, isPinned } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: "Title and content are required",
      data: null
    });
  }

  try {
    const note = new Note({ title, content, category, isPinned });
    await note.save();
    return res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: note
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create note",
      data: null
    });
  }
};

// 2. Bulk create notes (POST /api/notes/bulk)
const bulkCreateNotes = async (req, res) => {
  const { notes } = req.body;

  if (!notes || !Array.isArray(notes) || notes.length === 0) {
    return res.status(400).json({
      success: false,
      message: "notes array is required and cannot be empty",
      data: null
    });
  }

  try {
    const createdNotes = await Note.insertMany(notes);
    return res.status(201).json({
      success: true,
      message: `${createdNotes.length} notes created successfully`,
      data: createdNotes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create notes",
      data: null
    });
  }
};

// 3. Get all notes (GET /api/notes)
const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      count: notes.length,
      data: notes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
      data: null
    });
  }
};

// 4. Get note by ID (GET /api/notes/:id)
const getNoteById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid note ID",
      data: null
    });
  }

  try {
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note fetched successfully",
      data: note
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch note",
      data: null
    });
  }
};

// 5. Replace a note (PUT /api/notes/:id)
const replaceNote = async (req, res) => {
  const { id } = req.params;
  const { title, content, category, isPinned } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid note ID",
      data: null
    });
  }

  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: "Title and content are required",
      data: null
    });
  }

  try {
    const note = await Note.findByIdAndUpdate(
      id,
      { title, content, category: category || "personal", isPinned: isPinned || false },
      { new: true, overwrite: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note replaced successfully",
      data: note
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to replace note",
      data: null
    });
  }
};

const updateNote = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid note ID",
      data: null
    });
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: "No fields provided to update",
      data: null
    });
  }

  try {
    const note = await Note.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: note
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update note",
      data: null
    });
  }
};

const deleteNote = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid note ID",
      data: null
    });
  }

  try {
    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete note",
      data: null
    });
  }
};

const bulkDeleteNotes = async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({
      success: false,
      message: "ids array is required and cannot be empty",
      data: null
    });
  }

  try {
    const result = await Note.deleteMany({ _id: { $in: ids } });
    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} notes deleted successfully`,
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete notes",
      data: null
    });
  }
};

const getNotesByCategory = async (req, res) => {
  const { category } = req.params;
  const allowedCategories = ["work", "personal", "study"];

  if (!allowedCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      message: "Invalid category. Allowed: work, personal, study",
      data: null
    });
  }

  try {
    const notes = await Note.find({ category });

    if (notes.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No notes found for category: ${category}`,
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: `Notes fetched for category: ${category}`,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notes by category",
      data: null
    });
  }
};

const getNotesByStatus = async (req, res) => {
  const { isPinned } = req.params;

  if (isPinned !== "true" && isPinned !== "false") {
    return res.status(400).json({
      success: false,
      message: "isPinned must be true or false",
      data: null
    });
  }

  const pinned = isPinned === "true";

  try {
    const notes = await Note.find({ isPinned: pinned });
    return res.status(200).json({
      success: true,
      message: pinned ? "Fetched all pinned notes" : "Fetched all unpinned notes",
      count: notes.length,
      data: notes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notes by status",
      data: null
    });
  }
};

const getNoteSummary = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid note ID",
      data: null
    });
  }

  try {
    const note = await Note.findById(id).select("title category isPinned createdAt");

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note summary fetched successfully",
      data: note
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch note summary",
      data: null
    });
  }
};

const filterNotes = async (req, res) => {
  const filter = {};

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.isPinned !== undefined) {
    filter.isPinned = req.query.isPinned === "true";
  }

  try {
    const notes = await Note.find(filter);
    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      count: notes.length,
      data: notes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to filter notes",
      data: null
    });
  }
};

const getPinnedNotes = async (req, res) => {
  const filter = { isPinned: true };

  if (req.query.category) {
    filter.category = req.query.category;
  }

  try {
    const notes = await Note.find(filter);
    return res.status(200).json({
      success: true,
      message: "Pinned notes fetched successfully",
      count: notes.length,
      data: notes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch pinned notes",
      data: null
    });
  }
};

const filterByCategory = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Query param 'name' is required",
      data: null
    });
  }

  try {
    const notes = await Note.find({ category: name });
    return res.status(200).json({
      success: true,
      message: `Notes filtered by category: ${name}`,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to filter notes by category",
      data: null
    });
  }
};

const filterByDateRange = async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({
      success: false,
      message: "Both 'from' and 'to' query params are required",
      data: null
    });
  }

  try {
    const filter = {
      createdAt: {
        $gte: new Date(from),
        $lte: new Date(to)
      }
    };

    const notes = await Note.find(filter);
    return res.status(200).json({
      success: true,
      message: `Notes fetched between ${from} and ${to}`,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to filter notes by date range",
      data: null
    });
  }
};

module.exports = {
  createNote,
  bulkCreateNotes,
  getAllNotes,
  getNoteById,
  replaceNote,
  updateNote,
  deleteNote,
  bulkDeleteNotes,
  getNotesByCategory,
  getNotesByStatus,
  getNoteSummary,
  filterNotes,
  getPinnedNotes,
  filterByCategory,
  filterByDateRange
};
