const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Jokes = require('../models/jokes');
const Comment = require('../models/comments');

const isAuth = require('../middleware/is-auth');


router.post('/jokes/comment/:id', isAuth, async (req, res) => {
    try {
        const comment = new Comment({
            author: req.body.author,
            comment: req.body.comment,
            joke_id: req.params.id,
        });

        const jokeChecker = await Jokes.findById(req.params.id);
        if (jokeChecker) {
            await comment.save();
            res.json({
                success: true,
                comment: comment,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
router.get('/jokes/comment/:id', isAuth, async (req, res) => {
    try {
        const comment = await Comment.find({ joke_id: req.params.id }).sort({ createdAt: -1 });
        if (comment) {
            res.json({
                success: true,
                comment: comment,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;
