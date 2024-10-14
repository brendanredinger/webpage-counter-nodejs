const mongoose = require('mongoose');

// MongoDB connection string (Replace with your actual connection string)
const dbUri = 'mongodb+srv://brendan24:Br53998324@cluster0.pm5dr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });

// Define schema for storing page-specific view counters
const viewSchema = new mongoose.Schema({
  page: { type: String, unique: true },  // Unique identifier for each page (e.g., URL or slug)
  views: { type: Number, default: 0 }    // View count for that page
});

const ViewCounter = mongoose.model('ViewCounter', viewSchema);

// Initialize view counter for a specific page if it doesn't exist
async function initializeCounter(page) {
  const existingCounter = await ViewCounter.findOne({ page });
  if (!existingCounter) {
    const newCounter = new ViewCounter({ page, views: 0 });
    await newCounter.save();
  }
}

// Vercel API route handler
module.exports = async (req, res) => {
  const page = req.query.page || 'default';  // Get page identifier from the query string

  // Initialize counter for the specific page
  await initializeCounter(page);

  // Fetch and increment the view counter for the page
  const counter = await ViewCounter.findOne({ page });
  counter.views += 1;
  await counter.save();

  // Send the updated view count back to the client
  res.status(200).json({ views: counter.views });
};




// api/views.js

const mongoose = require('mongoose');

// MongoDB connection string (replace with your actual connection string)
const dbUri = process.env.MONGODB_URI || 'mongodb+srv://brendan24:Br53998324@cluster0.pm5dr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Mongoose options for the connection
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect to MongoDB
mongoose.connect(dbUri, options).then(() => {
  console.log('MongoDB connected successfully');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Define schema for storing page-specific view counters
const viewSchema = new mongoose.Schema({
  page: { type: String, unique: true },  // Unique identifier for each page
  views: { type: Number, default: 0 }    // View count for that page
});

const ViewCounter = mongoose.model('ViewCounter', viewSchema);

// Initialize view counter for a specific page if it doesn't exist
async function initializeCounter(page) {
  const existingCounter = await ViewCounter.findOne({ page });
  if (!existingCounter) {
    const newCounter = new ViewCounter({ page, views: 0 });
    await newCounter.save();
  }
}

// API route handler
module.exports = async (req, res) => {
  const page = req.query.page || 'default';  // Get page identifier from the query string

  // Initialize counter for the specific page
  await initializeCounter(page);

  // Fetch and increment the view counter for the page
  const counter = await ViewCounter.findOne({ page });
  counter.views += 1;
  await counter.save();

  // Send the updated view count back to the client
  res.status(200).json({ views: counter.views });
};
