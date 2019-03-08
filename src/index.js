const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');

const users = require('./routes/users');
const candidates = require('./routes/candidates');

const app = express();
mongoose.connect('mongodb://localhost:27017/polling');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.use('/users', users);
app.use('/candidates', candidates);

app.listen(3500);