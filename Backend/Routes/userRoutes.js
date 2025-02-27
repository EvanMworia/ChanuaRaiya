const express = require('express');
const {
	registerNewUser,
	login,
	getUserByEmail,
	getUsers,
	getUserById,
	deleteUser,
} = require('../Controllers/userController');

const userRouter = express.Router();

//routes
userRouter.post('/register', registerNewUser);
userRouter.post('/login', login);
userRouter.get('/all-users', getUsers);
userRouter.get('/id/:id', getUserById);
userRouter.get('/email/:email', getUserByEmail);
userRouter.delete('/delete/:id', deleteUser);

module.exports = userRouter;
