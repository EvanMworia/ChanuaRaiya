const { v4: uid } = require('uuid');
require('dotenv').config();
const DbHelper = require('../Database/databaseHelper');
const { uploadToS3 } = require('../Services/s3UploadService');
const db = new DbHelper();

async function addNewDocument(req, res) {
	try {
		// Ensure at least one file is uploaded
		if (!req.files || req.files.length === 0) {
			return res.status(400).json({ error: 'No Document uploaded' });
		}

		// Upload images to S3 using the upload service
		const documentUrls = await Promise.all(req.files.map((file) => uploadToS3(file, 'Documents')));

		// Extract other data from request body
		const { Title, Description } = req.body;
		const documentId = uid();

		// Store incident data in the database
		await db.executeProcedure('AddNewDocument', {
			DocumentId: documentId,
			Title,
			Description,
			DocumentURL: JSON.stringify(documentUrls),
		});

		res.status(201).json({
			message: 'Document Uploaded successfully',
			documentUrls,
		});
	} catch (error) {
		console.error('An error occurred while uploading the document', error);
		res.status(500).json({ message: `Internal server error: ${error.message}` });
	}
}

module.exports = { addNewDocument };
