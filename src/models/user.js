const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['admin', 'user']
    }
}, {
    versionKey: false
})
userSchema.pre('save', async function() {
    if (this.isModified('password') || this.isNew) {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
    }
})
userSchema.methods.comparePassword = async function(password) {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
}
module.exports = mongoose.model('User', userSchema);