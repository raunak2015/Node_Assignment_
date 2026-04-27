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

module.exports = {
  createNote,
  bulkCreateNotes,
  getAllNotes,
  getNoteById
};
