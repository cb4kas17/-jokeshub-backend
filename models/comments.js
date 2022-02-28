const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentsSchema = new Schema(
    {
        author: { type: String, required: true },
        comment: { type: String, required: true },
        joke_id: { type: String, required: true },
    },
    { timestamps: true }
);

const Comments = mongoose.model('Comments', commentsSchema);
module.exports = Comments;
