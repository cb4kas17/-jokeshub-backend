const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const isAuth = require('../middleware/is-auth');
const Jokes = require('../models/jokes');

router.post('/', async (req, res) => {
    try {
        const userData = await User.findOne({ userName: req.body.username });
        console.log(userData);
        if (!userData) {
            res.send('No username found');
        } else {
            let isMatch = await bcrypt.compare(req.body.password, userData.passWord);
            if (userData.userName === req.body.username && isMatch) {
                const accessToken = jwt.sign({ id: userData._id, username: userData.userName, name: userData.fullName }, 'secretKey', { expiresIn: '6h' });

                res.json({
                    success: true,
                    accessToken,
                });
            } else {
                res.send('incorrect password');
            }
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

router.post('/signup', async (req, res) => {
    try {
        let hashedPassword = await bcrypt.hash(req.body.password, 10);
        let user = new User({
            userName: req.body.username,
            passWord: hashedPassword,
            fullName: req.body.name,
        });

        const userNameChecker = await User.findOne({ userName: req.body.username });
        if (userNameChecker) {
            res.send('username exists');
        } else {
            await user.save();
            res.json({
                success: true,
                user: user,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

router.put('/updateProfile/:id', isAuth, async (req, res) => {
    try {
        let updateUserData = await User.findOneAndUpdate(
            { userName: req.params.id },
            {
                $set: {
                    fullName: req.body.name,
                },
            }
        );

        const jokesData = await Jokes.updateMany(
            { username: updateUserData.userName },
            {
                $set: {
                    author: req.body.name,
                },
            }
        );

        // const accessToken = jwt.sign({ id: userData._id, username: userData.userName, name: userData.fullName }, 'secretKey', { expiresIn: '60m' });
        console.log('this is the data' + updateUserData);
        console.log('jokes  ' + jokesData);
        res.json({ success: true, userData: updateUserData });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
router.put('/changePassword/:id', isAuth, async (req, res) => {
    try {
        const userData = await User.findOne({ userName: req.params.id });

        console.log(userData);
        let isMatch = await bcrypt.compare(req.body.oldPassword, userData.passWord);
        if (isMatch) {
            let hashedNewPassword = await bcrypt.hash(req.body.newPassword, 10);
            let updateUserData = await User.findOneAndUpdate(
                { userName: req.params.id },
                {
                    $set: {
                        passWord: hashedNewPassword,
                    },
                }
            );

            res.json({ success: true, updatedUser: updateUserData });
        } else {
            res.send('old password not matched');
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

router.get('/logout', isAuth, async (req, res) => {
    try {
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;
