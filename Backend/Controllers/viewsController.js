const DbHelper = require('../Database/databaseHelper');
const { v4: uid } = require('uuid');
const { shareViewSchema } = require('../Utils/validations');
const db = new DbHelper();

async function shareView(req, res) {
	try {
		const { error } = shareViewSchema.validate(req.body);
		if (error) {
			return res.status(400).json({ message: `${error.message}` });
		}

		const { Opinion } = req.body;

		const viewId = uid();
		// Execute stored procedure and retrieve the new UserID
		await db.executeProcedure('AddNewView', {
			ViewId: viewId,
			Opinion,
			TopicId,
			UserId,
		});

		res.status(201).json({
			message: `Your opinion/view has been registered successfully`,
		});
	} catch (error) {
		console.error('Error happened ', error);
		res.status(500).json({ message: 'Server Error' });
	}
}

async function getAllViews(req, res) {
	try {
		let results = await db.executeProcedure('GetAllViews', {});

		res.status(200).json(results.recordset);
	} catch (error) {
		console.error('❌ Error fetching Views:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}
async function getViewById(req, res) {
	try {
		const { id } = req.params;

		const foundView = await db.executeProcedure('GetViewById', { ViewId: id });
		if (!foundView) {
			res.status(404).json({ message: 'No View was found with that id' });
		}

		res.status(200).json(foundView.recordset);
	} catch (error) {
		console.error('Something went wwrong', error);
		res.status(500).json({ message: 'Internal server Error' });
	}
}
async function deleteView(req, res) {
	try {
		const { id } = req.params;
		const foundView = await db.executeProcedure('GetViewById', { ViewId: id });
		if (!foundView) {
			res.status(404).json({ message: 'No Discussion View was found with that id' });
		}
		await db.executeProcedure('DeleteView', { ViewId: id });
		res.status(200).json({ message: `Discussion View has been deleted successfully` });
	} catch (error) {
		console.error('Something went wwrong', error);
		res.status(500).json({ message: 'Internal server Error' });
	}
}

module.exports = { shareView, getAllViews, getViewById, deleteView };
