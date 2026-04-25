const Note = require("../models/note.model");

// 1. Create a new note
const createNote = async (req, res) => {
  try {
    const { title, content, category, isPinned } = req.body;

    // validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
        data: null
      });
    }

    const note = new Note({
      title: title,
      content: content,
      category: category,
      isPinned: isPinned
    });

    await note.save();

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create note",
      data: null
    });
  }
};

// 2. Bulk create notes
const bulkCreateNotes = async (req, res) => {
  try {
    const { notes } = req.body;

    if (!notes || notes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Notes array is required and cannot be empty",
        data: null
      });
    }

    const createdNotes = await Note.insertMany(notes);

    res.status(201).json({
      success: true,
      message: createdNotes.length + " notes created successfully",
      data: createdNotes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create notes",
      data: null
    });
  }
};

// 3. Get all notes
const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      data: notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
      data: null
    });
  }
};

// 4. Get a note by ID
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: "Note fetched successfully",
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch note",
      data: null
    });
  }
};

// 5. Replace a note (PUT)
const replaceNote = async (req, res) => {
  try {
    const { title, content, category, isPinned } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
        data: null
      });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title: title,
        content: content,
        category: category || "personal",
        isPinned: isPinned || false
      },
      { new: true, overwrite: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: "Note replaced successfully",
      data: updatedNote
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to replace note",
      data: null
    });
  }
};

// 6. Update a note (PATCH)
const updateNote = async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: updatedNote
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update note",
      data: null
    });
  }
};

// 7. Delete a note
const deleteNote = async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);

    if (!deletedNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
      data: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete note",
      data: null
    });
  }
};

// 8. Bulk delete notes
const bulkDeleteNotes = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Ids array is required and cannot be empty",
        data: null
      });
    }

    const result = await Note.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: result.deletedCount + " notes deleted successfully",
      data: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete notes",
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
  bulkDeleteNotes
};
