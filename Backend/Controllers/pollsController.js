const DbHelper = require('../Database/databaseHelper');
const { v4: uid } = require('uuid');
const { createPollSchema } = require('../Utils/validations');

// const { sendTopicCreationEmail } = require('../Services/emailService');
const db = new DbHelper();

async function createNewPoll(req, res) {
	try {
		const { error } = createPollSchema.validate(req.body);
		if (error) {
			return res.status(400).json({ message: `${error.message}` });
		}

		const { Question } = req.body;

		const pollId = uid();
		// Execute stored procedure and retrieve the new UserID
		await db.executeProcedure('AddNewPoll', {
			PollId: pollId,
			Question,
		});

		res.status(201).json({
			message: `The Poll has been created successfully`,
		});
		// let usersFound = (await db.executeProcedure('GetAllUsers', {})).recordset;
		// usersFound.forEach((user) => {
		// 	sendTopicCreationEmail(user.Email, user.Username, Title);
		// });
	} catch (error) {
		console.error('Error happened ', error);
		res.status(500).json({ message: 'Server Error' });
	}
}
async function getAllPolls(req, res) {
	try {
		let results = await db.executeProcedure('GetAllPolls', {});

		res.status(200).json(results.recordset);
	} catch (error) {
		console.error('❌ Error fetching Polls:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}
async function getPollById(req, res) {
	try {
		const { id } = req.params;

		const foundPoll = await db.executeProcedure('GetPollById', { PollId: id });
		if (!foundPoll) {
			res.status(404).json({ message: 'No Poll was found with that id' });
		}

		res.status(200).json(foundPoll.recordset);
	} catch (error) {
		console.error('Something went wwrong', error);
		res.status(500).json({ message: 'Internal server Error' });
	}
}
async function deletePoll(req, res) {
	try {
		const { id } = req.params;
		const foundPoll = await db.executeProcedure('GetPollById', { PollId: id });
		if (!foundPoll) {
			res.status(404).json({ message: 'No Discussion Poll was found with that id' });
		}
		await db.executeProcedure('DeletePoll', { PollId: id });
		res.status(200).json({ message: `Poll has been deleted successfully` });
	} catch (error) {
		console.error('Something went wwrong', error);
		res.status(500).json({ message: 'Internal server Error' });
	}
}

module.exports = { createNewPoll, getAllPolls, getPollById, deletePoll };
