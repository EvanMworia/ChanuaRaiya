// 🚀 Import core packages needed for the server
const express = require('express'); // Framework to build the server
const cors = require('cors'); // To allow/disallow cross-origin requests
const morgan = require('morgan'); // For logging HTTP requests

const multer = require('multer');
const summarizeRoutes = require('./Routes/summarizeRoutes');

const path = require('path');
const dotenv = require('dotenv');

dotenv.config();
const userRouter = require('./Routes/userRoutes');
const topicsRouter = require('./Routes/topicsRoutes');
const viewsRouter = require('./Routes/viewsRoutes');
const pollsRouter = require('./Routes/pollRoutes');
// const incidentsRouter = require('./Routes/incidentRoutes');
const updatedIncidentRouter = require('./Routes/updatedIncidentRoutes');
const documentsRouter = require('./Routes/documentRoutes');

//Initialize the Express application
const app = express();

//Middleware to handle cross-origin requests
app.use(cors());

// 📝 Middleware for logging HTTP requests
app.use(morgan('dev'));
// ✅ 'dev' gives concise colored output for development purposes.

//Middleware to parse incoming JSON requests (req.body)
app.use(express.json());
// This allows Express to automatically parse JSON payloads in requests.

//=================AI SUMMARIZER

// Set up storage for uploaded files (store in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Test route
app.get('/', (req, res) => {
	res.send('AI Document Summarization API');
});

// Import Routes
app.use('/api/summarize', summarizeRoutes);
//==================

// 🚦 Route Middlewares - direct requests to relevant route files
app.use('/users', userRouter);
app.use('/topics', topicsRouter);
app.use('/views', viewsRouter);
app.use('/polls', pollsRouter);
app.use('/incidents', updatedIncidentRouter);
app.use('/documents', documentsRouter);

// 🚀 Start the server and listen for incoming requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT} 🚀`));
// ✅ The server listens on the specified port from the .env file or defaults to 5000.
