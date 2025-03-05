const express = require('express');
const { shareView, getAllViews, getViewById, deleteView, getViewsOnATopic } = require('../Controllers/viewsController');
const viewsRouter = express.Router();

viewsRouter.post('/create-view', shareView);
viewsRouter.get('/get-all-views', getAllViews);
viewsRouter.get('/get-view/:id', getViewById);
viewsRouter.get('/topic-views/:id', getViewsOnATopic);
viewsRouter.delete('/delete-view/:id', deleteView);

module.exports = viewsRouter;
