const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine","ejs");
mongoose.connect('mongodb://localhost:27017/todolistDB',{useNewUrlParser:true , useUnifiedTopology: true,useFindAndModify: false });
const itemsSchema = {
  name: String
};
const Item = mongoose.model('Item',itemsSchema);
const item1 = new Item({
  name:"Welcome to your to-do-list."
});
const item2 = new Item({
  name:"click '+' to add something"
});
const item3 = new Item({
  name:'<< - check this to delete something'
});
const defualtItems = [item1,item2,item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};
const List = mongoose.model('List',listSchema);

app.get("/",function(req,res){
  Item.find({},function(err,foundItems){
    if(foundItems.length === 0){
      Item.insertMany(defualtItems,(err)=>{
        if(err){
          console.log(err);
        }else {
          console.log("insert items successfully");
        }
      });
      res.redirect("/");
    }else {
        res.render("list",{listHeading:'today', newListItems:foundItems});
    }
  });
});


app.post("/",function(req,res){
  let newItem = req.body.enterItem;
  let listName = req.body.lists;
  const item = new Item ({
    name: newItem
  });
  if(listName === "today"){
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name:listName}, (err,foundlist)=>{
      foundlist.items.push(item);
      foundlist.save();
      res.redirect(`/${listName}`);
    });
  }

});

app.get("/:customListName",(req,res)=>{
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({name:customListName},(err,foundList)=>{
    if(!err){
      if(!foundList){
        const list = new List({
          name:customListName,
          items:defualtItems
        });
        list.save();
        res.redirect(`/${customListName}`);
      }else{
        res.render('list',{listHeading:foundList.name, newListItems:foundList.items});
      }
    }
  });
});
app.post("/delete",(req,res)=>{
  const checkId = req.body.checkbox;
  const listName = req.body.listName;
  if(listName === "today"){
    Item.findByIdAndRemove(checkId,(err)=>{
      if(!err){
        console.log("successfully deleted item");
      }
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkId}}},(err,foundList)=>{
      if(err){
        console.log(err);
      }
    });
    res.redirect(`/${listName}`);
  }

});

app.listen(3000, function(){
  console.log("server started at port 3000!");
});
