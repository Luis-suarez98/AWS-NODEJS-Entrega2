const express = require("express");

const app = express();

app.get("/",(req,res) => {
    res.send("hello world");
});

app.post("/",(req,res) => {
    res.send("Este es el post");
});

app.listen(3000, () => {
    console.log("server running on portno",3000);
});