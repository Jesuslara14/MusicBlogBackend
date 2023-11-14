const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
    caption: String,
    tags: String,
    image: String,
    author: String,
    authorId: String,
});

module.exports = mongoose.model('Post', postSchema);