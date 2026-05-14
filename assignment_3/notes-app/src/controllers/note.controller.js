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

// 8. Bulk delete notes (DELETE /api/notes/bulk)
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

// 9. Search notes by title (GET /api/notes/search)
const searchNotesByTitle = async (req, res) => {
  const query = req.query.q || req.query.query;

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Search query is required",
      data: null
    });
  }

  try {
    const notes = await Note.find({
      title: { $regex: query, $options: "i" }
    });

    return res.status(200).json({
      success: true,
      message: `Notes matching title query: '${query}'`,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to search notes",
      data: null
    });
  }
};

// 10. Search notes by content (GET /api/notes/search/content)
const searchNotesByContent = async (req, res) => {
  const query = req.query.q || req.query.query;

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Search query is required",
      data: null
    });
  }

  try {
    const notes = await Note.find({
      content: { $regex: query, $options: "i" }
    });

    return res.status(200).json({
      success: true,
      message: `Notes matching content query: '${query}'`,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to search notes by content",
      data: null
    });
  }
};

// 11. Search in title and content (GET /api/notes/search/all)
const searchAllNotes = async (req, res) => {
  const query = req.query.q || req.query.query;

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Search query is required",
      data: null
    });
  }

  try {
    const notes = await Note.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } }
      ]
    });

    return res.status(200).json({
      success: true,
      message: `Notes matching query in title or content: '${query}'`,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to search notes",
      data: null
    });
  }
};

// 12. Filter + Sort notes (GET /api/notes/filter-sort)
const filterSortNotes = async (req, res) => {
  const { category, isPinned, sortBy, order } = req.query;

  const filter = {};
  if (category) {
    filter.category = category;
  }
  if (isPinned !== undefined) {
    filter.isPinned = isPinned === "true";
  }

  const sortOptions = {};
  const allowedSortFields = ["title", "createdAt", "updatedAt", "category", "isPinned"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  const sortOrder = order === "asc" ? 1 : -1;
  sortOptions[sortField] = sortOrder;

  try {
    const notes = await Note.find(filter).sort(sortOptions);

    return res.status(200).json({
      success: true,
      message: "Notes fetched with filtering and sorting",
      count: notes.length,
      data: notes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch filter-sorted notes",
      data: null
    });
  }
};

// 13. Filter + Paginate notes (GET /api/notes/filter-paginate)
const filterPaginateNotes = async (req, res) => {
  const { category, isPinned } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (category) {
    filter.category = category;
  }
  if (isPinned !== undefined) {
    filter.isPinned = isPinned === "true";
  }

  try {
    const total = await Note.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const notes = await Note.find(filter).skip(skip).limit(limit);

    return res.status(200).json({
      success: true,
      message: "Notes fetched with filtering and pagination",
      data: notes,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch filter-paginated notes",
      data: null
    });
  }
};

// 14. Sort + Paginate notes (GET /api/notes/sort-paginate)
const sortPaginateNotes = async (req, res) => {
  const { sortBy, order } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const sortOptions = {};
  const allowedSortFields = ["title", "createdAt", "updatedAt", "category", "isPinned"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  const sortOrder = order === "asc" ? 1 : -1;
  sortOptions[sortField] = sortOrder;

  try {
    const total = await Note.countDocuments();
    const totalPages = Math.ceil(total / limit);
    const notes = await Note.find().sort(sortOptions).skip(skip).limit(limit);

    return res.status(200).json({
      success: true,
      message: "Notes fetched with sorting and pagination",
      data: notes,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch sort-paginated notes",
      data: null
    });
  }
};

// 15. Search + Filter notes (GET /api/notes/search-filter)
const searchFilterNotes = async (req, res) => {
  const { q, query, category, isPinned } = req.query;
  const searchQuery = q || query;

  const filter = {};
  if (category) {
    filter.category = category;
  }
  if (isPinned !== undefined) {
    filter.isPinned = isPinned === "true";
  }

  if (searchQuery) {
    filter.$or = [
      { title: { $regex: searchQuery, $options: "i" } },
      { content: { $regex: searchQuery, $options: "i" } }
    ];
  }

  try {
    const notes = await Note.find(filter);

    return res.status(200).json({
      success: true,
      message: "Notes fetched with search and filtering",
      count: notes.length,
      data: notes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch search-filtered notes",
      data: null
    });
  }
};

// 16. Search + Sort + Paginate notes (GET /api/notes/search-sort-paginate)
const searchSortPaginateNotes = async (req, res) => {
  const { q, query, sortBy, order } = req.query;
  const searchQuery = q || query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (searchQuery) {
    filter.$or = [
      { title: { $regex: searchQuery, $options: "i" } },
      { content: { $regex: searchQuery, $options: "i" } }
    ];
  }

  const sortOptions = {};
  const allowedSortFields = ["title", "createdAt", "updatedAt", "category", "isPinned"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  const sortOrder = order === "asc" ? 1 : -1;
  sortOptions[sortField] = sortOrder;

  try {
    const total = await Note.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const notes = await Note.find(filter).sort(sortOptions).skip(skip).limit(limit);

    return res.status(200).json({
      success: true,
      message: "Notes fetched with search, sorting, and pagination",
      data: notes,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch search-sort-paginated notes",
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
  searchNotesByTitle,
  searchNotesByContent,
  searchAllNotes,
  filterSortNotes,
  filterPaginateNotes,
  sortPaginateNotes,
  searchFilterNotes,
  searchSortPaginateNotes
};











