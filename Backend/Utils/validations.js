const Joi = require('joi');

const registerUserSchema = Joi.object({
	Username: Joi.string().required(),
	Email: Joi.string().email().required(),
	// PasswordHash: Joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$')),
	Password: Joi.string().required(),
});

const loginUserSchema = Joi.object({
	Email: Joi.string().email().required(),
	// PasswordHash: Joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$')),
	Password: Joi.string().required(),
});

module.exports = { registerUserSchema, loginUserSchema };
