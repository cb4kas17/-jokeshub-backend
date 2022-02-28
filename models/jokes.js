const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jokesSchema = new Schema(
    {
        author: { type: String, required: true },
        username: { type: String, required: true },
        content: { type: String, required: true },
        comments: [{ type: String }],
    },
    { timestamps: true }
);

const Jokes = mongoose.model('Jokes', jokesSchema);

module.exports = Jokes;
