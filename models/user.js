const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
     email: {
         type: String,
         required: true,
         minlength: 5,
         maxlength: 255,
         unique: true
     },
     password: {
         type: String,
         required: true,
         minlength: 6,
         maxlength: 1024
     }, 
     isAdmin: {
        type: Boolean,
        default: false
     } 

});
userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin}, config.get('jwt'));
}

const User = mongoose.model('User', userSchema );

function validateUser(user) {
    const schema = {
        name: Joi.string().min(3).max(25).required(),
        email: Joi.string().min(5).max(50).email().required(),
        password: Joi.string().min(6).max(12).required()
    };
    return Joi.validate(user, schema);
}

exports.validate = validateUser;
exports.User = User;