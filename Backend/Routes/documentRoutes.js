const express = require('express');
const multer = require('multer');
const {
	addNewDocument,
	getAllDocuments,
	getDocumentById,
	deleteDocument,
} = require('../Controllers/documentsController');
// const { reportIncident } = require('../Controllers/updatedIncidentsController');
// const { reportIncident } = require('../controllers/incidentsController');

const documentsRouter = express.Router();

// Configure Multer for handling image uploads
const upload = multer({ storage: multer.memoryStorage() });

documentsRouter.post('/new-document', upload.array('documents', 5), addNewDocument);
documentsRouter.get('/all-documents', getAllDocuments);
documentsRouter.get('/document/:id', getDocumentById);
documentsRouter.delete('/document/:id', deleteDocument);

module.exports = documentsRouter;
