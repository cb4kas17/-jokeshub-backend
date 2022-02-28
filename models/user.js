const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: { type: String, required: true, unique: true },
    passWord: { type: String, required: true },
    fullName: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
