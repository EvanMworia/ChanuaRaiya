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

async function getAllDocuments(req, res) {
	try {
		let results = await db.executeProcedure('GetAllDocuments', {});

		res.status(200).json(results.recordset);
	} catch (error) {
		console.error('❌ Error fetching Documents:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}
async function getDocumentById(req, res) {
	try {
		const { id } = req.params;

		const foundDocument = await db.executeProcedure('GetDocumentById', { DocumentId: id });
		if (!foundDocument) {
			res.status(404).json({ message: 'No Document was found with that id' });
		}

		res.status(200).json(foundDocument.recordset);
	} catch (error) {
		console.error('Something went wwrong', error);
		res.status(500).json({ message: 'Internal server Error' });
	}
}
async function deleteDocument(req, res) {
	try {
		const { id } = req.params;
		const foundDocument = await db.executeProcedure('GetDocumentById', { DocumentId: id });
		if (!foundDocument) {
			res.status(404).json({ message: 'No  Document was found with that id' });
		}
		await db.executeProcedure('DeleteDocument', { DocumentId: id });
		res.status(200).json({ message: `The Document has been deleted successfully` });
	} catch (error) {
		console.error('Something went wwrong', error);
		res.status(500).json({ message: 'Internal server Error' });
	}
}
module.exports = { addNewDocument, getAllDocuments, getDocumentById, deleteDocument };
