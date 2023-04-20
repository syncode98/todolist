const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const date=require(__dirname + "/day.js")
const dotenv = require("dotenv")

dotenv.config()
const items=[];
const workItems=[];
const mongoose=require("mongoose")

const host = '0.0.0.0';
const port = process.env.PORT || 3000
const uri = process.env.MONGODB_URI;


const connectDB = async () => {
    try {
      await mongoose.connect(uri)
  
      console.log('MongoDB connected!!')
    } catch (err) {
      console.log('Failed to connect to MongoDB', err)
    }
  }
  connectDB();
  app.listen(port,host,()=>console.log("Server started"))
const itemsSchema= new mongoose.Schema({
    name:String,
    })
const Item  = mongoose.model("Item",itemsSchema); 
const listSchema={
    name:String,
    items:[itemsSchema]
}
const List = mongoose.model("List",listSchema)
const item1 = new Item({
    name:"Hi! Welcome to the TodoList!",
})
const item2 = new Item({
    name:"Add the items that you want to save",
})
const item3 = new Item({
    name:"To delete them, click on the checkbox",
})
const defaultItems=[item1,item2,item3]

app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));

//Get route that sends the word hello when user acceses it
app.get("/",function(req,res){
    
    const day = date.getDate();
    
    Item.find().then(foundItems =>{
       
        if (foundItems.length===0){
                res.render("list",{listTitle:day ,newListItems:defaultItems})
            }else{
                res.render("list",{listTitle:day ,newListItems:foundItems});
            }
})

    
        
})

//Redirect to home route when a new item is added since it is only possible to render once
app.post("/",function(req,res){
    console.log(req.body)
    const currentItem = req.body.newItem;
    const tempItem = new Item({
        name:currentItem
    });
    tempItem.save();
    res.redirect("/")

    
})
app.get("/work",function(req,res){
    
    res.render("list",{listTitle:"Work",newListItems:workItems})

})
app.get("/:customListName",function(req,res){
    const customListName=req.params.customListName
    List.findOne({name:customListName}).then(function(err,foundList){
        if(!err){
            if(!foundList){
                console.log("Does not exist")
            }else{
                console.log("Exists")
            }
        }
    });
    const list = new List({
        name:customListName,
        items:defaultItems
    })
    list.save();
 
    res.render("list",{listTitle:customListName,newListItems:defaultItems})
})
app.post("/work",function(req,res){
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work")
})
app.post("/delete",function(req,res){
    const id=req.body.checkbox
    Item.findByIdAndDelete(id).then(()=>{
        res.redirect("/")
    
       }).catch(err=>console.log(err))

    
})
app.get("/about",function(req,res){
    res.render("about");
})
