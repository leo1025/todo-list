// Server file for app
// Author: Leona

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const{ Schema } = mongoose;

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin:V1VzB6nAXg58NpcX@cluster0.ed4cmtf.mongodb.net/todoListDB", {useNewUrlParser: true});

const itemsSchema = new Schema({
    name: String
});

const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
    name:"Welcome to your ToDo List!"});
const item2 = new Item({
    name:"Hit the + button to add new item."});
const item3 = new Item({
    name:"<-- Hit this to delete an item."});

const defaultItems = [item1, item2, item3];

// Embedded Schema for relational/dimensional lists in MongoDB
const listSchema = new Schema({
    name: String,
    items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);

// Processes requests from client. When accessing root, will send back some data.
app.get("/", function(req, res) {
    Item.find({}, function(err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err){
                if(err) {
                    console.log(err);
                } else {
                    console.log("Successfully saved default items to DB.");
                }
            });
            res.redirect("/");
        } else {
            res.render('list', {listTitle: "Today", newItemList: foundItems});
        }
    });
});

app.get("/:listName", function(req, res) {
    const customListName = _.capitalize(req.params.listName);

    List.findOne({name: customListName}, function(err, foundList){
        if(!err) {
            if (!foundList) {
                // Create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });

                list.save();
                res.redirect("/" + customListName);
            } else {
                // Show an existing list
                res.render('list', {listTitle: foundList.name, newItemList: foundList.items});
            }
        }
    });
});

app.get("/about", function(req, res) {
    res.render("about");
});

app.post("/", function(req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        // Find the list based on returned List name.
        // Push item to that list
        // Save list to MongoDB
        List.findOne({name: listName}, function(err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
});

app.post("/delete", function(req, res) {
    const checkedItemID = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemID, function(err) {
            if(!err) {
                console.log("Successfully deleted checked item.");
                res.redirect("/");
            }
        });
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemID}}}, function(err, foundList) {
            if(!err) {
                res.redirect("/" + listName);
            }
        });
    }
});

// Opens listening port for server. Can be viewed from Nodemon
app.listen(3000, function() {
    console.log("Server started on port 3000");
});

