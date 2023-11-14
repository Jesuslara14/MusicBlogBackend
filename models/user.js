const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    bio: String,
    email: String,
    password: String,
    avatar: String,
    bands: [String]
});

module.exports = mongoose.model('User', userSchema);