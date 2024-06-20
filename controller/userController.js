const User = require("../model/userSchema")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const asyncHandler = require("express-async-handler")

const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body

    if (!name || !email || !password) {
        res.status(401)
        throw new Error("Pls fill all details")
    }

    const userExist = await User.findOne({ email })

    if (userExist) {
        res.status(401)
        throw new Error("User Already Exist")
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            token: generateToken(user.id)
        })
    } else {
        res.status(401)
        throw new Error("Invalid Credentials")
    }

})

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    if (!email || !password) {
        res.status(401)
        throw new Error("Pls fill all Details")
    }

    const user = await User.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            password: user.password
        })
    } else {
        res.status(401)
        throw new Error("Not Authorized")
    }

})

const getMe = (req, res) => {
    res.status(201).json({
        message: "I am from Get Me"
    })
}

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    })
}

module.exports = { registerUser, loginUser, getMe }