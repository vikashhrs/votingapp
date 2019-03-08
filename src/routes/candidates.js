const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Candidate = require('../models/candidate');
const User = require('../models/user');

router
    .post('/', authHandler, async(req, res) => {
        try {
            if (req.userType != 'admin') {
                throw {
                    code: 401,
                    message: 'Only admins can create candidates'
                }
            }
            let newCandidate = new Candidate(req.body);
            let candidate = await newCandidate.save();
            res.json({ _id: candidate._id, name: candidate.name, handle: candidate.handle, votesInFavor: 0 });
        } catch (error) {
            if (error.name === 'MongoError' && error.code === 11000) {
                return res.status(409).send(`Duplicate key ${error.message}`);
            } else if (error.code === 401) {
                return res.status(401).send(error.message);
            }
            res.status(500).send(error);
        }
    })
    .get('/', authHandler, async(req, res) => {
        let selectFields = {};
        if (req.userType != 'admin') {
            selectFields._id = 1;
            selectFields.name = 1;
            selectFields.handle = 1;
        }
        try {
            let candidates = await Candidate.find({}, selectFields);
            res.json(candidates);
        } catch (error) {
            res.status(500).send(error);
        }
    });

router.put('/:_id', authHandler, async(req, res) => {
    try {
        if (req.userType != 'user') {
            throw {
                code: 401,
                message: 'You are not an user'
            }
        }
        let candidate = await Candidate.findByIdAndUpdate({ _id: req.params._id }, { $inc: { votesInFavor: 1 } }, { new: true });
        if (!candidate)
            return res.status(404).send('No such candidate!');
        else
            return res.json(candidate);
    } catch (err) {
        res.status(err.code === 401 ? err.code : 500).send(err.code === 401 ? err.message : 'Server Error!');
    }
})

async function authHandler(req, res, next) {
    try {
        const _id = jwt.verify(req.headers.authorization, 'tokenSecret');
        const user = await User.findOne({ _id });
        if (!user)
            res.status(401).send('Unauthorized!');
        else {
            req.userType = user.type;
            next();
        }
    } catch (err) {
        res.status(err.name === 'JsonWebTokenError' ? 401 : 500).send(err.name === 'JsonWebTokenError' ? 'Unauthorized!' : 'Server Error!');
    }
}



module.exports = router;