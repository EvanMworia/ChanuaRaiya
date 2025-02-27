const express = require('express');
const { createNewTopic, getAllTopics, getTopicById, deleteTopic } = require('../Controllers/topicsController');
const topicsRouter = express.Router();

topicsRouter.post('/create-topic', createNewTopic);
topicsRouter.get('/get-all-topics', getAllTopics);
topicsRouter.get('/get-topic/:id', getTopicById);
topicsRouter.delete('/delete-topic/:id', deleteTopic);

module.exports = topicsRouter;
