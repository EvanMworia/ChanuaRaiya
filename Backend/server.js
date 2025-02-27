// 🚀 Import core packages needed for the server
const express = require('express'); // Framework to build the server
const cors = require('cors'); // To allow/disallow cross-origin requests
const morgan = require('morgan'); // For logging HTTP requests

const userRouter = require('./Routes/userRoutes');
const topicsRouter = require('./Routes/topicsRoutes');

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

// 🚦 Route Middlewares - direct requests to relevant route files
app.use('/users', userRouter);
app.use('/topics', topicsRouter);

// 🚀 Start the server and listen for incoming requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT} 🚀`));
// ✅ The server listens on the specified port from the .env file or defaults to 5000.
