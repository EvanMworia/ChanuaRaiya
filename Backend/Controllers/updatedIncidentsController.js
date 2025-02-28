const { v4: uid } = require('uuid');
require('dotenv').config();
const DbHelper = require('../Database/databaseHelper');
const { uploadToS3 } = require('../Services/s3UploadService');
const db = new DbHelper();

async function reportIncident(req, res) {
	try {
		// Ensure at least one file is uploaded
		if (!req.files || req.files.length === 0) {
			return res.status(400).json({ error: 'No images uploaded' });
		}

		// Upload images to S3 using the upload service
		const imageUrls = await Promise.all(req.files.map((file) => uploadToS3(file, 'images')));

		// Extract other data from request body
		const { Description, Location, UserId } = req.body;
		const incidentId = uid();

		// Store incident data in the database
		await db.executeProcedure('AddNewIncident', {
			IncidentId: incidentId,
			Description,
			Location,
			UserId,
			MediaURL: JSON.stringify(imageUrls),
		});

		res.status(201).json({
			message: 'Incident reported successfully',
			imageUrls,
		});
	} catch (error) {
		console.error('An error occurred while reporting your incident', error);
		res.status(500).json({ message: `Internal server error: ${error.message}` });
	}
}

module.exports = { reportIncident };
