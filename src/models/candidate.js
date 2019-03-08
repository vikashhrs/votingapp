const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const candidateSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    handle: {
        type: String,
        required: true,
        unique: true
    },
    votesInFavor: {
        type: Number,
        default: 0
    }
}, {
    versionKey: false
})

module.exports = mongoose.model('Candidate', candidateSchema);