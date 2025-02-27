const DbHelper = require('../Database/databaseHelper');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uid } = require('uuid');
const path = require('path');
const { registerUserSchema, loginUserSchema } = require('../Utils/validations');
const { sendWelcomeEmail } = require('../Services/emailService');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const db = new DbHelper();

async function registerNewUser(req, res) {
	try {
		const { error } = registerUserSchema.validate(req.body);
		if (error) {
			return res.status(400).json({ message: `${error.message}` });
		}

		const { Username, Email, Password } = req.body;

		// Check if the email already exists
		const existingEmail = await db.executeProcedure('GetUserByEmail', { Email });
		if (existingEmail.length > 0) {
			return res.status(400).json({ message: 'Email is already in use' });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(Password, 10);
		const userId = uid();
		// Execute stored procedure and retrieve the new UserID
		await db.executeProcedure('UpsertUser', {
			UserId: userId,
			Username,
			Email,
			PasswordHash: hashedPassword,
		});

		res.status(201).json({
			message: `User ${Username} has been created successfully`,
		});

		await sendWelcomeEmail(Email, Username);
		// sendWelcomeEmail(Email, FullName);
		//sendWelcomeSMS(Phone, FullName);
	} catch (error) {
		console.error('Error happened ', error);
		res.status(500).json({ message: 'Server Error' });
	}
}
async function login(req, res) {
	try {
		const { error } = loginUserSchema.validate(req.body);
		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}

		const { Email, Password } = req.body;

		const userFound = (await db.executeProcedure('GetUserByEmail', { Email })).recordset;
		if (userFound.length === 0) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}
		const user = userFound[0];
		const isPasswordMatch = await bcrypt.compare(Password, user.PasswordHash);
		if (!isPasswordMatch) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}
		const token = jwt.sign({ userId: user.UserId, email: user.Email, role: user.Role }, process.env.JWT_SECRET, {
			expiresIn: '1h',
		});
		return res.status(200).json({ message: 'Succesful Login', token });
	} catch (error) {
		console.error('Something unexpected happened', error);
		res.status(500).json({ message: 'Server Error' });
	}
}

async function getUsers(req, res) {
	try {
		let results = await db.executeProcedure('GetAllUsers', {});

		res.status(200).json(results.recordset);
	} catch (error) {
		console.error('❌ Error fetching users:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}
async function deleteUser(req, res) {
	try {
		const { id } = req.params;
		const foundUser = await db.executeProcedure('GetUserById', { UserId: id });
		if (!foundUser) {
			res.status(404).json({ message: 'No user was found with that id' });
		}
		await db.executeProcedure('DeleteUser', { UserId: id });
		res.status(200).json({ message: `${foundUser.recordset[0].Username} has been deleted successfully` });
	} catch (error) {
		console.error('Something went wwrong', error);
		res.status(500).json({ message: 'Internal server Error' });
	}
}
async function getUserById(req, res) {
	try {
		const { id } = req.params;

		const foundUser = await db.executeProcedure('GetUserById', { UserId: id });
		if (!foundUser) {
			res.status(404).json({ message: 'No user was found with that id' });
		}

		res.status(200).json(foundUser.recordset);
	} catch (error) {
		console.error('Something went wwrong', error);
		res.status(500).json({ message: 'Internal server Error' });
	}
}

async function getUserByEmail(req, res) {
	try {
		const { email } = req.params;

		const foundUser = await db.executeProcedure('GetUserByEmail', { Email: email });
		if (!foundUser) {
			res.status(404).json({ message: 'No user was found with that Email' });
		}
		console.log(foundUser);
		res.status(200).json(foundUser.recordset);
	} catch (error) {
		console.error('Something went wwrong', error);
		res.status(500).json({ message: 'Internal server Error' });
	}
}

module.exports = { registerNewUser, login, getUsers, getUserByEmail, getUserById, deleteUser };
