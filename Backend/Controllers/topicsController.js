const DbHelper = require('../Database/databaseHelper');
const { v4: uid } = require('uuid');
const { createTopicSchema } = require('../Utils/validations');
const { sendTopicCreationEmail } = require('../Services/emailService');
const db = new DbHelper();

async function createNewTopic(req, res) {
	try {
		const { error } = createTopicSchema.validate(req.body);
		if (error) {
			return res.status(400).json({ message: `${error.message}` });
		}

		const { Title, Context } = req.body;

		const topicId = uid();
		// Execute stored procedure and retrieve the new UserID
		await db.executeProcedure('AddNewTopic', {
			TopicId: topicId,
			Title,
			Context,
		});

		res.status(201).json({
			message: `The discussion topic has been created successfully`,
		});
		let usersFound = (await db.executeProcedure('GetAllUsers', {})).recordset;
		usersFound.forEach((user) => {
			sendTopicCreationEmail(user.Email, user.Username, Title);
		});
	} catch (error) {
		console.error('Error happened ', error);
		res.status(500).json({ message: 'Server Error' });
	}
}

async function getAllTopics(req, res) {
	try {
		let results = await db.executeProcedure('GetAllTopics', {});

		res.status(200).json(results.recordset);
	} catch (error) {
		console.error('❌ Error fetching Topics:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}
async function getTopicById(req, res) {
	try {
		const { id } = req.params;

		const foundTopic = await db.executeProcedure('GetTopicById', { TopicId: id });
		if (!foundTopic) {
			res.status(404).json({ message: 'No Topic was found with that id' });
		}

		res.status(200).json(foundTopic.recordset);
	} catch (error) {
		console.error('Something went wwrong', error);
		res.status(500).json({ message: 'Internal server Error' });
	}
}
async function deleteTopic(req, res) {
	try {
		const { id } = req.params;
		const foundTopic = await db.executeProcedure('GetTopicById', { TopicId: id });
		if (!foundTopic) {
			res.status(404).json({ message: 'No Discussion topic was found with that id' });
		}
		await db.executeProcedure('DeleteTopic', { TopicId: id });
		res.status(200).json({ message: `Discussion Topic has been deleted successfully` });
	} catch (error) {
		console.error('Something went wwrong', error);
		res.status(500).json({ message: 'Internal server Error' });
	}
}

module.exports = { deleteTopic, getAllTopics, getTopicById, createNewTopic };
