const mongoose = require('mongoose');

const bandSchema = new mongoose.Schema({
    name: String,
    desc: String,
    password: String,
    genres: String,
    members: [String]
});

module.exports = mongoose.model('Band', bandSchema);