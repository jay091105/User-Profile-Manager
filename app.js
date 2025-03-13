require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI,{}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Define User Schema
const userSchema = new mongoose.Schema({
    first_name: String,
    email: String,
    age: Number
});

const User = mongoose.model('customer', userSchema, 'customer');

// Insert a new user dynamically
app.post('/api/users', async (req, res) => {
    try {
        const user = new User(req.body);
        const result = await user.save();
        console.log('User Inserted:', result);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Fetch all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        console.log('All Users:', users);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
