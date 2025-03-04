const express = require('express');
const multer = require('multer');
const {
	reportIncident,
	getAllIncidents,
	getIncidentById,
	deleteIncident,
} = require('../Controllers/updatedIncidentsController');
// const { reportIncident } = require('../controllers/incidentsController');

const updatedIncidentRouter = express.Router();

// Configure Multer for handling image uploads
const upload = multer({ storage: multer.memoryStorage() });

updatedIncidentRouter.post('/new-incident', upload.array('images', 5), reportIncident);
updatedIncidentRouter.get('/all-incidents', getAllIncidents);
updatedIncidentRouter.get('/incident/:id', getIncidentById);
updatedIncidentRouter.delete('/incident/:id', deleteIncident);

module.exports = updatedIncidentRouter;
