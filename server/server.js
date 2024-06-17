require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
const dbConfig = require('./config/dbConfig');
const port = process.env.PORT || 5000;

const usersRoute = require('./routes/userRoute');
const productsRoute = require("./routes/productsRoute");
const bidsRoute = require("./routes/bidsRoute");
const notificationsRoute = require('./routes/notificationsRoute');

app.use('/api/users', usersRoute);
app.use("/api/products", productsRoute);
app.use('/api/bids', bidsRoute);
app.use('/api/notifications', notificationsRoute);


// deployment config
const path = require("path");
__dirname = path.resolve();

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "/client/build")));
    app.get("*", (req, res)=>{
        res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    });
}

app.listen(port, ()=>console.log(`Node/Express JS Server started on port ${port}`));