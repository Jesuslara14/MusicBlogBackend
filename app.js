// Globals
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const Band = require('./models/band');
const Post = require('./models/post');
const app = express();
const PORT = process.env.PORT || 4000;
const saltRounds = 10;

// Connect to MongoDB

mongoose.connect('mongodb+srv://JesusLara69:student2023@cluster0.ynwmqwh.mongodb.net/BlogApp')
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error(`Error connecting to MongoDB ${err}`)
});

// Middleware

app.use(bodyParser.json());
app.use(cors());

// Routes

app.get('/get-posts', async (req, res, next) => {
    await Post
    .find()
    .then(result => {
        res.json({
            data: result,
            message: "All items succesfully fetched",
            status: 200
        })
    })
    .catch(err => {
        return next(err);
    });
});

app.get('/search-posts:term', async (req, res, next) => {
    const regex = new RegExp(req.params.term, 'i');
    await Post.find({tags: {$regex: regex}})
    .then(result => {
        res.json({
            data: result,
            message: "All items succesfully fetched",
            status: 200
        });
    })
    .catch(error => {
        console.log(error);
    });
});

app.get('/search-user-posts:id', async (req, res) => {
    await Post.find({authorId : req.params.id})
    .then(result => {
        res.json({
            data: result,
            message: "All items succesfully fetched",
            status: 200
        });
    })
    .catch(error => {
        console.log(error);
    });
});

app.get('/search-user:id', async (req, res, next) => {
    await User.findById(req.params.id)
    .then(result => {
        if(result){
            res.json({
                data: {
                    username: result.username,
                    bio: result.bio,
                    email: result.email,
                    avatar: result.avatar,
                    bands: result.bands,
                    user_id: result._id
                },
                message: "Account found",
                status: 200
            });
        } else {
            res.json({
                message: "Account not found",
                status: 404
            })
        }
    });
});

app.post('/log-user', async (req, res, next) => {
    await User.findOne({email : req.body.email})
    .then(result => {
        if(result){
            bcrypt.compare(req.body.password, result.password, function(err, match) {
                if(match){
                    res.json({
                    data: {
                        username: result.username,
                        bio: result.bio,
                        email: result.email,
                        avatar: result.avatar,
                        bands: result.bands,
                        user_id: result._id
                    },
                    message: "Account found and logged in successfully",
                    status: 200
                    });
                } else {
                    res.json({
                        message: "Password is incorrect",
                        status: 403
                    })
                }
            });
            
        }else{
            res.json({
                message: "Account doesn't exist",
                status: 404
            })
        }
    })
});

app.post('/register-user', async (req, res, next) => {
    await User.findOne({email : req.body.email})
    .then(async result => {
        if(result){
            res.json({
                message: "An account under this email already exists",
                status: 403
            })
        }else{
            bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
                await User.create({
                    username: req.body.username,
                    email: req.body.email,
                    password: hash,
                    bands: []
                })
                .then(result => {
                    res.json({
                        data: {
                            username: result.username,
                            bio: result.bio,
                            email: result.email,
                            avatar: result.avatar,
                            bands: result.bands,
                            user_id: result._id
                        },
                        message: "User successfully registered",
                        status: 200
                    });
                });
            });
        }
    });    
});

app.post('/edit-user:id', async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, req.body)
    .then(async () => {
        await Post.updateMany({ authorId:req.params.id }, { author: req.body.username });
    });
});

app.post('/create-post', async (req, res, next) => {
    await Post.create(req.body)
    .then(() => {
        res.json({
            message: "Post created",
            status: 200
        })
    })
    .catch(err => {
        return next(err);
    });
});

// Initiate Server

app.listen(PORT, () => {
    console.log(`Server now running at port: ${PORT}`);
});