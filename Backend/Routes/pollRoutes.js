const express = require('express');
const { createNewPoll, getAllPolls } = require('../Controllers/pollsController');
const pollsRouter = express.Router();

pollsRouter.post('/create-poll', createNewPoll);
pollsRouter.get('/all-polls', getAllPolls);

module.exports = pollsRouter;
