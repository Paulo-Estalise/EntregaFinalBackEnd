const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: { type: String },
    githubId: { type: String, unique: true, sparse: true }, // GitHub ID
    role: { type: String, default: 'user' } 
});

module.exports = mongoose.model('User', userSchema);