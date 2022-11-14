// Server file for app
// Author: Leona

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js") // Requiring custom module. Binds exports to date

const app = express();

const items = [];
const workItems = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Processes requests from client. When accessing root, will send back some data.
app.get("/", function(req, res) {
    let day = date.getDate();

    res.render('list', {listTitle: day, newItemList: items});
});

app.get("/work", function(req, res) {
    res.render("list", {listTitle: "Work List", newItemList: workItems});
});

app.get("/about", function(req, res) {
    res.render("about");
});

app.post("/", function(req, res) {
    const item = req.body.newItem;

    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
});

// Opens listening port for server. Can be viewed from Nodemon
app.listen(3000, function() {
    console.log("Server started on port 3000");
});

