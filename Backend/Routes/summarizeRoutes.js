const express = require('express');
const { summarizeDocument, getSummarisedOpinions } = require('../Controllers/summarizeController');
const multer = require('multer');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
router.get('/summarize-opinions/:id', getSummarisedOpinions);
router.post('/', upload.single('file'), summarizeDocument);

module.exports = router;
