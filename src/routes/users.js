const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post('/', async(req, res) => {
    try {
        let newUser = new User(req.body);
        let user = await newUser.save();
        res.status(201).json({ _id: user._id, email: user.email, type: user.type });
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            res.status(409).send(`Duplicate key ${error.message}`);
        }
        res.status(500).send(error);
    }
});

router.post('/login', async(req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(401).json({ error: 'Unauthorized!' })
        const isMatch = await user.comparePassword(req.body.password);
        if (!isMatch)
            return res.status(403).json({ error: 'Invalid credentials!' })
        const token = jwt.sign({ _id: user._id }, 'tokenSecret', { expiresIn: '1d' });
        return res.json({ success: true, token, type: user.type });
    } catch (error) {
        res.status(500).send('Server Error! Try after sometime!');
    }
});

router.get('/type/:token', async(req, res) => {
    try {
        const _id = jwt.verify(req.params.token, 'tokenSecret');
        const user = await User.findOne({ _id });
        if (!user)
            res.status(401).send('Unauthorized!');
        else {
            res.json({ _id: user._id, email: user.email, type: user.type });
        }
    } catch (err) {
        res.status(err.name === 'JsonWebTokenError' ? 401 : 500).send(err.name === 'JsonWebTokenError' ? 'Unauthorized!' : 'Server Error!');
    }
})

module.exports = router;