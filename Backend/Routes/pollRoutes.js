const express = require('express');
const { createNewPoll, getAllPolls, getPollById, deletePoll } = require('../Controllers/pollsController');
const pollsRouter = express.Router();

pollsRouter.post('/create-poll', createNewPoll);
pollsRouter.get('/all-polls', getAllPolls);
pollsRouter.get('/poll/:id', getPollById);
pollsRouter.delete('/poll/:id', deletePoll);

module.exports = pollsRouter;
