const Note = require("../models/note.model");
const mongoose = require("mongoose");

const getValidationErrorResponse = (error) => {
	if (error.name === "ValidationError") {
		return {
			status: 400,
			message: error.message,
		};
	}

	return null;
};

const createNote = async (req, res) => {
	const { title, content, category, isPinned } = req.body;

	if (!title || !content) {
		return res.status(400).json({
			success: false,
			message: "Title and content are required",
			data: null,
		});
	}

	try {
		const note = await Note.create({ title, content, category, isPinned });
		return res.status(201).json({
			success: true,
			message: "Note created successfully",
			data: note,
		});
	} catch (error) {
		const validationError = getValidationErrorResponse(error);
		if (validationError) {
			return res.status(validationError.status).json({
				success: false,
				message: validationError.message,
				data: null,
			});
		}

		return res.status(500).json({
			success: false,
			message: "Failed to create note",
			data: null,
		});
	}
};

const bulkCreateNotes = async (req, res) => {
	const { notes } = req.body;

	if (!Array.isArray(notes) || notes.length === 0) {
		return res.status(400).json({
			success: false,
			message: "Notes array is required and cannot be empty",
			data: null,
		});
	}

	try {
		const createdNotes = await Note.insertMany(notes);
		return res.status(201).json({
			success: true,
			message: `${createdNotes.length} notes created successfully`,
			data: createdNotes,
		});
	} catch (error) {
		const validationError = getValidationErrorResponse(error);
		if (validationError) {
			return res.status(validationError.status).json({
				success: false,
				message: validationError.message,
				data: null,
			});
		}

		return res.status(500).json({
			success: false,
			message: "Failed to create notes",
			data: null,
		});
	}
};

const getAllNotes = async (_req, res) => {
	try {
		const notes = await Note.find().sort({ createdAt: -1 });
		return res.status(200).json({
			success: true,
			message: "Notes fetched successfully",
			data: notes,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch notes",
			data: null,
		});
	}
};

const getNoteById = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({
			success: false,
			message: "Invalid note id",
			data: null,
		});
	}

	try {
		const note = await Note.findById(id);

		if (!note) {
			return res.status(404).json({
				success: false,
				message: "Note not found",
				data: null,
			});
		}

		return res.status(200).json({
			success: true,
			message: "Note fetched successfully",
			data: note,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch note",
			data: null,
		});
	}
};

const replaceNote = async (req, res) => {
	const { id } = req.params;
	const { title, content, category, isPinned } = req.body;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({
			success: false,
			message: "Invalid note id",
			data: null,
		});
	}

	if (!title || !content) {
		return res.status(400).json({
			success: false,
			message: "Title and content are required",
			data: null,
		});
	}

	const replacement = {
		title,
		content,
		category: category ?? "personal",
		isPinned: isPinned ?? false,
	};

	try {
		const note = await Note.findByIdAndUpdate(id, replacement, {
			new: true,
			overwrite: true,
			runValidators: true,
		});

		if (!note) {
			return res.status(404).json({
				success: false,
				message: "Note not found",
				data: null,
			});
		}

		return res.status(200).json({
			success: true,
			message: "Note replaced successfully",
			data: note,
		});
	} catch (error) {
		const validationError = getValidationErrorResponse(error);
		if (validationError) {
			return res.status(validationError.status).json({
				success: false,
				message: validationError.message,
				data: null,
			});
		}

		return res.status(500).json({
			success: false,
			message: "Failed to replace note",
			data: null,
		});
	}
};

const updateNote = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({
			success: false,
			message: "Invalid note id",
			data: null,
		});
	}

	if (!req.body || Object.keys(req.body).length === 0) {
		return res.status(400).json({
			success: false,
			message: "No fields provided to update",
			data: null,
		});
	}

	try {
		const note = await Note.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!note) {
			return res.status(404).json({
				success: false,
				message: "Note not found",
				data: null,
			});
		}

		return res.status(200).json({
			success: true,
			message: "Note updated successfully",
			data: note,
		});
	} catch (error) {
		const validationError = getValidationErrorResponse(error);
		if (validationError) {
			return res.status(validationError.status).json({
				success: false,
				message: validationError.message,
				data: null,
			});
		}

		return res.status(500).json({
			success: false,
			message: "Failed to update note",
			data: null,
		});
	}
};

const deleteNote = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({
			success: false,
			message: "Invalid note id",
			data: null,
		});
	}

	try {
		const note = await Note.findByIdAndDelete(id);

		if (!note) {
			return res.status(404).json({
				success: false,
				message: "Note not found",
				data: null,
			});
		}

		return res.status(200).json({
			success: true,
			message: "Note deleted successfully",
			data: null,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to delete note",
			data: null,
		});
	}
};

const bulkDeleteNotes = async (req, res) => {
	const { ids } = req.body;

	if (!Array.isArray(ids) || ids.length === 0) {
		return res.status(400).json({
			success: false,
			message: "Ids array is required and cannot be empty",
			data: null,
		});
	}

	const hasInvalidId = ids.some((id) => !mongoose.Types.ObjectId.isValid(id));
	if (hasInvalidId) {
		return res.status(400).json({
			success: false,
			message: "One or more note ids are invalid",
			data: null,
		});
	}

	try {
		const result = await Note.deleteMany({ _id: { $in: ids } });
		return res.status(200).json({
			success: true,
			message: `${result.deletedCount} notes deleted successfully`,
			data: null,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to delete notes",
			data: null,
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
};
