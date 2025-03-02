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

const createTopicSchema = Joi.object({
	Title: Joi.string().required(),
	Context: Joi.string().optional(),
});
const createPollSchema = Joi.object({
	Question: Joi.string().required(),
});

const addPollOptionSchema = Joi.object({
	PollId: Joi.string().required(),
	OptionText: Joi.string().required(),
});

const castVoteSchema = Joi.object({
	UserId: Joi.string().required(),
	PollId: Joi.string().required(),
	OptionId: Joi.string().required(),
});

const shareViewSchema = Joi.object({
	Opinion: Joi.string().required(),
	TopicId: Joi.string().required(),
	UserId: Joi.string().required(),
});
module.exports = {
	registerUserSchema,
	loginUserSchema,
	createTopicSchema,
	shareViewSchema,
	createPollSchema,
	addPollOptionSchema,
	castVoteSchema,
};
