const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const postRoutes = require('./routes/posts')
const userRoutes = require('./routes/user');

const mongoose = require('mongoose')
    //mongo "mongodb+srv://cluster0.wgves.mongodb.net/<dbname>"--username muhodari

mongoose.connect('mongodb://localhost:27017/SavePic', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((() => {
    console.log('connected to database successfully!')
})).catch(() => {
    console.log('failed to conect to database');
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")))

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept,Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE,PUT, OPTIONS"
    );
    next();
});


app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);
module.exports = app;