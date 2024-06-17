const mongoose = require('mongoose');

// const mongo = "mongodb://localhost:27017/LuxeCart";
const mongo = process.env.MONGO_DB;
mongoose.connect(mongo);

const connection = mongoose.connection;

connection.on("connected", ()=>{
    console.log("MongoDB connected successfully");
})

connection.on("error", (err)=>{
    console.log("connecting to MongoDB failed");
})

module.exports = connection;