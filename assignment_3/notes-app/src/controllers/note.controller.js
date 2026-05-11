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

// 6. Update a note (PATCH /api/notes/:id)
const updateNote = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid note ID",
      data: null
    });
  }

  try {
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: updatedNote
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
        data: null
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to update note",
      data: null
    });
  }
};

// 7. Delete a note (DELETE /api/notes/:id)
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

module.exports = {
  createNote,
  bulkCreateNotes,
  getAllNotes,
  getNoteById,
  replaceNote,
  updateNote,
  deleteNote
};


