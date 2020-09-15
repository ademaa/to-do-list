const express = require('express');
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");

const app = express();

let items = ['buy food','cook food','eat food'];
let workItems = [];
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine","ejs");

app.get("/",function(req,res){

let days = date.shortDate();
res.render("list",{listHeading:days, theItem:items});
});
app.post("/",function(req,res){
  let item = req.body.enterItem;
  if(req.body.lists === "Work item"){
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }


});
app.get("/work",function(req,res){
  res.render("list",{listHeading:"Work item",theItem:workItems});

});
app.get("/about",function(req,res){
  res.render("about");
});
app.listen(3000, function(){
  console.log("server started at port 3000!");
});
