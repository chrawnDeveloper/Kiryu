var express = require("express");
var app = express();
var path = require("path");
app.use(express.static(path.join(__dirname, 'public')));
const axios = require("axios");


app.get("/", async(req, res) => {
    var filePath = path.join(__dirname, "public", "home.html");
    res.sendFile(filePath);
});

app.listen(4000, () => {
    console.log("Server on port 4000");
});
