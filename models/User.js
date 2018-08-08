const mongoose = require('mongoose')
const Schema = mongoose.Schema

const loginSchema = new Schema({
    username: String,
    password: String,
    passwordConf: String,
    todos: Array
}) 

module.exports = mongoose.model('Login', loginSchema);