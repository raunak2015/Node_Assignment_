const Note = require("../models/note.model");

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
		return res.status(500).json({
			success: false,
			message: "Failed to create notes",
			data: null,
		});
	}
};

module.exports = {
	createNote,
	bulkCreateNotes,
};
