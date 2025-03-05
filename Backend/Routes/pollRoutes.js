const express = require('express');
const {
	createNewPoll,
	getAllPolls,
	getPollById,
	deletePoll,
	addPollOption,
	getPollOptionsOnAPoll,
	castVote,
	getPollResults,
	getPollWithOptions,
} = require('../Controllers/pollsController');
const pollsRouter = express.Router();

pollsRouter.post('/create-poll', createNewPoll);
pollsRouter.post('/add-poll-option', addPollOption);
pollsRouter.post('/cast-vote', castVote);
pollsRouter.get('/results/:PollId', getPollResults);
pollsRouter.get('/all-polls', getAllPolls);
pollsRouter.get('/all-poll-options/:id', getPollOptionsOnAPoll);
pollsRouter.get('/poll/:id', getPollById);
pollsRouter.get('/:PollId', getPollWithOptions);

pollsRouter.delete('/poll/:id', deletePoll);

module.exports = pollsRouter;
