const mongoose = require("mongoose")
const connectDB = async() => {
    try {
        await mongoose.connect("mongodb+srv://prashant7470:prashant7470@cluster0.kxqv6lv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        console.log(`Database Connected`.rainbow);
    } catch (error) {
        console.log(`Database not Connected`.bgRed);
    }
}

module.exports = connectDB