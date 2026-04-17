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

module.exports = {
	createNote,
};
