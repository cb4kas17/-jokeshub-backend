const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Jokes = require('../models/jokes');

const isAuth = require('../middleware/is-auth');

router.get('/allJokes', isAuth, async (req, res) => {
    try {
        const jokes = await await Jokes.find().sort({ createdAt: -1 });
        console.log(jokes);
        res.json({
            success: true,
            jokes: jokes,
            user: req.user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

router.post('/createJokes', isAuth, async (req, res) => {
    try {
        let joke = new Jokes({
            author: req.body.author,
            content: req.body.content,
            username: req.user.username,
        });
        await joke.save();
        res.json({
            success: true,
            joke: joke,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

router.get('/allJokes/:id', isAuth, async (req, res) => {
    try {
        const joke = await Jokes.findById(req.params.id);
        console.log(joke);
        res.json({
            success: true,
            joke: joke,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

router.get('/myJokes', isAuth, async (req, res) => {
    try {
        const myJokes = await Jokes.find({ username: req.user.username }).sort({ createdAt: -1 });
        console.log('myjokes' + myJokes);
        res.json({
            success: true,
            myJokes: myJokes,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

router.put('/EditJokes/:id', isAuth, async (req, res) => {
    try {
        const joke = await Jokes.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    content: req.body.content,
                },
            }
        );
        res.json({
            success: true,
            joke: joke,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

router.delete('/EditJokes/:id', isAuth, async (req, res) => {
    try {
        const joke = await Jokes.findByIdAndDelete(req.params.id);
        res.json({
            success: true,
            joke: joke,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

router.get('/getUser', isAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({
            success: true,
            user: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
module.exports = router;
