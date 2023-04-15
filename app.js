const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const date=require(__dirname + "/day.js")
const items=[];
const workItems=[];
const mongoose=require("mongoose")

const host='0.0.0.0'
const port=process.env.PORT||3000
main().catch(err => console.log(err));
async function main() {
    //await mongoose.connect('mongodb://0.0.0.0:27017/todolistDB');
    await mongoose.connect('mongodb+srv://muthu98:muthu98@mutz.lcgql2l.mongodb.net/todolistDB');

  }
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
    name:"Hi!Welcome to the TodoList",
})
const item2 = new Item({
    name:"Add the items that you want to save",
})

const defaultItems=[item1,item2]
Item.insertMany(defaultItems)
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));

//Get route that sends the word hello when user acceses it
app.get("/",function(req,res){
    
    const day = date.getDate();

   Item.find({}).then(foundItems=>{
    
    if (foundItems.length===0){
        console.log(foundItems);
        res.redirect("/")
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
app.listen(port,host);