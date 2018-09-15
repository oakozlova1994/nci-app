const {validate, User} = require('../models/user');
const auth = require('../middleware/auth');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/me', auth, async (req, res) => {  // GET: /api/users/me
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.post('/', async (req, res) => {  // POST: /api/users
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken(); 
    res.header('x-auth-token', token)
        .send({
            name: user.name,
            email: user.email

    });
});

module.exports = router;