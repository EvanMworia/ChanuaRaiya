const DbHelper = require('../Database/databaseHelper');
const { v4: uid } = require('uuid');
const { createPollSchema, addPollOptionSchema, castVoteSchema } = require('../Utils/validations');

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
async function addPollOption(req, res) {
	try {
		const { error } = addPollOptionSchema.validate(req.body);
		if (error) {
			return res.status(400).json({ message: `${error.message}` });
		}

		const { PollId, OptionText } = req.body;

		// Execute stored procedure and retrieve the new UserID
		await db.executeProcedure('AddNewPollOption', {
			PollId,
			OptionText,
		});

		res.status(201).json({
			message: `The Poll Option has been created successfully`,
		});
	} catch (error) {
		console.error('Error happened ', error);
		res.status(500).json({ message: 'Server Error' });
	}
}
// async function castVote(req, res) {
// 	try {
// 		const { error } = castVoteSchema.validate(req.body);
// 		if (error) {
// 			return res.status(400).json({ message: `${error.message}` });
// 		}

// 		const voteId = uid();
// 		const { UserId, PollId, OptionId } = req.body;

// 		// Execute stored procedure and retrieve the new UserID
// 		await db.executeProcedure('CastVote', {
// 			VoteId: voteId,
// 			UserId,
// 			PollId,
// 			OptionId,
// 		});

// 		res.status(201).json({
// 			message: `Your vote has been recorded successfully`,
// 		});
// 	} catch (error) {
// 		console.error('Error happened ', error);
// 		res.status(500).json({ message: 'Server Error' });
// 	}
// }
async function castVote(req, res) {
	try {
		const { error } = castVoteSchema.validate(req.body);
		if (error) {
			return res.status(400).json({ message: `${error.message}` });
		}

		const voteId = uid();
		const { UserId, PollId, OptionId } = req.body;

		try {
			// Execute stored procedure
			await db.executeProcedure('CastVote', {
				VoteId: voteId,
				UserId,
				PollId,
				OptionId,
			});

			res.status(201).json({
				message: `Your vote has been recorded successfully`,
			});
		} catch (dbError) {
			// Check if it's the "already voted" error from SQL Server
			if (dbError.message.includes('User has already voted in this poll.')) {
				return res.status(400).json({ message: 'You have already voted in this poll and cannot vote again.' });
			}

			// For any other database errors
			console.error('Database error:', dbError);
			res.status(500).json({ message: 'Server Error' });
		}
	} catch (error) {
		console.error('Error happened ', error);
		res.status(500).json({ message: 'Server Error' });
	}
}
async function getPollResults(req, res) {
	try {
		const { PollId } = req.params;

		// Execute stored procedure
		const result = await db.executeProcedure('GetPollResults', { PollId });
		const votesPerOption = result.recordsets[0]; // First result set (options & votes)
		const totalVotes = result.recordsets[1][0]?.TotalVotes || 0; // Second result set (TotalVotes)

		res.status(200).json({
			PollId,
			TotalVotes: totalVotes,
			Results: votesPerOption,
		});
	} catch (error) {
		console.error('Error fetching poll results:', error);
		res.status(500).json({ message: 'Server Error' });
	}
}

async function getPollWithOptions(req, res) {
	try {
		const { PollId } = req.params;

		// Fetch poll question
		const pollResult = await db.executeProcedure('GetPollById', { PollId });

		// Fetch poll options
		const optionsResult = await db.executeProcedure('GetAllPollOptions', { PollId });

		// Check if poll exists
		if (!pollResult.recordset.length) {
			return res.status(404).json({ message: 'Poll not found' });
		}

		// Format the response
		const poll = pollResult.recordset[0]; // Assuming there's only one poll
		const options = optionsResult.recordset;

		res.status(200).json({
			PollId: poll.PollId,
			Question: poll.Question,
			CreatedAt: poll.CreatedAt,
			Options: options.map((option) => ({
				OptionId: option.OptionId,
				OptionText: option.OptionText,
			})),
		});
	} catch (error) {
		console.error('Error fetching poll with options:', error);
		res.status(500).json({ message: 'Server Error' });
	}
}

async function getPollOptionsOnAPoll(req, res) {
	try {
		const { id } = req.params;
		let results = await db.executeProcedure('GetAllPollOptions', {
			PollId: id,
		});

		res.status(200).json(results.recordset);
	} catch (error) {
		console.error('❌ Error fetching Poll options:', error);
		res.status(500).json({ error: 'Internal Server Error' });
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

module.exports = {
	createNewPoll,
	getAllPolls,
	getPollById,
	getPollResults,
	deletePoll,
	addPollOption,
	getPollOptionsOnAPoll,
	castVote,
	getPollWithOptions,
};
