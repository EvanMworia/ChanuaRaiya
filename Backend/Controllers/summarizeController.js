const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const axios = require('axios');
const DbHelper = require('../Database/databaseHelper');
require('dotenv').config();

const db = new DbHelper();

exports.summarizeDocument = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: 'No file uploaded' });
		}

		let extractedText = '';

		// Identify file type
		const fileType = req.file.mimetype;

		if (fileType === 'application/pdf') {
			const data = await pdfParse(req.file.buffer);
			extractedText = data.text;
		} else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
			const result = await mammoth.extractRawText({ buffer: req.file.buffer });
			extractedText = result.value;
		} else if (fileType.startsWith('text/')) {
			extractedText = req.file.buffer.toString('utf-8');
		} else {
			return res.status(400).json({ error: 'Unsupported file format' });
		}

		if (!extractedText.trim()) {
			return res.status(400).json({ error: 'Could not extract text from file' });
		}

		// Send extracted text to OpenAI for summarization
		const summary = await getSummaryFromOpenAI(extractedText);

		res.json({ summary });
	} catch (error) {
		console.error('Error processing file:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

async function getSummaryFromOpenAI(text) {
	try {
		const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
		const response = await axios.post(
			'https://api.openai.com/v1/chat/completions',
			{
				model: 'gpt-3.5-turbo',
				messages: [
					{ role: 'system', content: 'Summarize the following text:' },
					{ role: 'user', content: text },
				],
				temperature: 0.5,
				max_tokens: 500,
			},
			{
				headers: {
					Authorization: `Bearer ${OPENAI_API_KEY}`,
					'Content-Type': 'application/json',
				},
			}
		);

		return response.data.choices[0].message.content.trim();
	} catch (error) {
		console.error('Error calling OpenAI:', error.response?.data || error.message);
		return 'Error summarizing the document.';
	}
}

// OpenAI API Key stored securely in .env
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Route to summarize opinions
exports.getSummarisedOpinions = async (req, res) => {
	try {
		const { id } = req.params;
		console.log('Executing GetTopicById with ID:', id);
		let foundTopic = await db.executeProcedure('GetTopicById', { TopicId: id });
		console.log('Raw result', foundTopic);
		console.log(foundTopic.recordset);
		if (foundTopic.recordset.length === 0) {
			return res.status(404).json({ message: 'No Topic was found with that id' });
		}
		console.log('This is what we found', foundTopic.recordset);

		// Fetch opinions for the topic from the database
		let opinions = await db.executeProcedure('GetViewsFromATopic', { TopicId: id });

		if (opinions.recordset.length === 0) {
			return res.json({ summary: 'No opinions available to summarize.' });
		}

		// Concatenate opinions into a single string
		const opinionsText = opinions.recordset.map((op) => op.Opinion).join('\n');

		// Call OpenAI API for summarization
		const aiResponse = await axios.post(
			'https://api.openai.com/v1/chat/completions',
			{
				model: 'gpt-3.5-turbo',
				messages: [
					{ role: 'system', content: 'Summarize the following user opinions concisely.' },
					{ role: 'user', content: opinionsText },
				],
				max_tokens: 150,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${OPENAI_API_KEY}`,
				},
			}
		);

		const summary = aiResponse.data.choices?.[0]?.message?.content || 'Could not generate a summary.';
		res.json({ summary });
	} catch (error) {
		console.error('Error summarizing opinions:', error);
		res.status(500).json({ error: 'Failed to generate summary.' });
	}
};
