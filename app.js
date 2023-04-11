const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const date=require(__dirname + "/day.js")
const items=[];
const workItems=[];
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));
//Get route that sends the word hello when user acceses it
app.get("/",function(req,res){
    
    const day = date.getDate();

    //var today=new Date();
    //const currentDay = today.getDay();
   // var options={
    //    weekday:"long",
    //    day:"numeric",
    //    month:"long"
    //}
    //var day  =today.toLocaleDateString("en-US",options);
    /*
    switch(currentDay){
        case(0):day="Sunday";break;
        case(1):day="Monday";break;
        case(2):day="Tuesday";break;
        case(3):day="Wednesday";break;
        case(4):day="Thursay";break;
        case(5):day="Friday";break;
        case(6):day="Saturday";break;        
    }*/

    res.render("list",{listTitle:day ,newListItems:items});
})

//Redirect to home route when a new item is added since it is only possible to render once
app.post("/",function(req,res){
    console.log(req.body)
    let item = req.body.newItem;
    if (req.body.list ==='Work'){
        workItems.push(item)
        res.redirect('/work')
    }else{
        items.push(item);
        res.redirect("/")
    }
    
    
    
})
app.get("/work",function(req,res){
    
    res.render("list",{listTitle:"Work",newListItems:workItems})

})
app.post("/work",function(req,res){
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work")
})
app.get("/about",function(req,res){
    res.render("about");
})
app.listen(3000);