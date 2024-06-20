const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Pls add name"]
    },
    email: {
        type: String,
        required: [true, "Pls add email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Pls add password"]
    },
    isAdmin: {
        type: String,
        required: true,
        default: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("User", userSchema)