const express = require("express")
const color = require("colors")
require("dotenv").config()
const connectDB = require("./config/db")
const { errorHandler } = require("./middleware/errorHandler")
const app = express()
const PORT = 5000

connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.status(201).json({ message: "API is Working" })
})

app.use("/api/user", require("./router/userRouter"))
app.use("/api/blogs",require("./router/blogRouter"))

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`PORT is running on ${PORT}`.bgMagenta);
})
