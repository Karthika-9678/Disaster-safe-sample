const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection string
mongoose.connect('mongodb+srv://shajimamtha04:Mamtha28@em-button.r45fjr7.mongodb.net/?retryWrites=true&w=majority&appName=Em-button',{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connection established"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const PoliceStation = require('./models/PoliceStation');

const seedData = [
  {
    name: "Thrissur Town Police Station",
    latitude: 10.5241,
    longitude: 76.2190,
    phone: "+91 487 2422222"
  },
  {
    name: "Ollur Police Station",
    latitude: 10.4720,
    longitude: 76.2423,
    phone: "+91 487 2356789"
  }
];

// Optional: Run only once
async function loadData() {
  await PoliceStation.insertMany(seedData);
  console.log("✅ Police stations inserted");
}

loadData();


const express = require('express');
const app = express();
const connectDB = require('./config/db');

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Load Routes
const policeRoutes = require('./routes/policeRoutes');
app.use('/api', policeRoutes); // All police APIs prefixed with /api

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
