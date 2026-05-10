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

module.exports = {
  createNote
};
