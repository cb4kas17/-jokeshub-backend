const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
require('dotenv').config();

//middlewares
app.use(bodyParser.json()); //application/json, parses incoming json data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(express.json());
//routes
const homeRoute = require('./routes/home');
const jokesRoute = require('./routes/jokes');
const commentsRoute = require('./routes/comments');
app.use('/api', homeRoute);
app.use('/api', jokesRoute);
app.use('/api', commentsRoute);

//error route
app.use((req, res) => {
    res.status(404).send('<h1>error 404</h1>');
});
//database connection
mongoose
    .connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log('connected to database! listening to port: ' + process.env.PORT);
        app.listen(process.env.PORT); //request listener, only fires when successfully connected to database
    })
    .catch((err) => {
        console.log(err);
    });
