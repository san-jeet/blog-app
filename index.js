var express = require("express");
var mongoose = require("mongoose");
var bodyparser = require("body-parser");
var app = express();
var methodOverride = require("method-override");
var sanitizer = require("express-sanitizer");
app.use(express.static("public"));
//Establishing connection to database
app.use(bodyparser.urlencoded({extended:true}));
app.use(sanitizer());
app.use(methodOverride("_method"));
mongoose.connect('mongodb://localhost:27017/blog_app', {useNewUrlParser: true, useUnifiedTopology: true});

//Creating Schema

var schema = new mongoose.Schema(
{
	title:String,
	image:String,
	body:String,
	created:{type:Date,default:Date.now}
})

// Modelling

var entry = mongoose.model("blog",schema);

//Adding starting data
  //==========Done and Removed
//Adding Routes

//Index page
app.get("/blogs",function(req,res)
	   {
			entry.find({},function(err,data)
					  {
				if(err)
					{
						console.log("Something went wrong.");
					}
				else
				{
					res.render("index.ejs",{data:data});
				}
				
			})	
})
app.get("/",function(req,res)
	   {
	res.redirect("/blogs");
})
//New 
app.get("/blogs/new",function(req,res)
	   {
			res.render("new.ejs");
})
//Post
app.post("/blogs",function(req,res)
		{
			req.body.blog.body = req.sanitize(req.body.blog.body);
			entry.create(req.body.blog,function(err,data)
						{
				if(err)
					{
						console.log("Cannot add data!!");
					}
				else{
					res.redirect("/blogs");
				}
			})
});
//Show
app.get("/blogs/:id",function(req,res)
	   {
			entry.findById(req.params.id,function(err,data)
						  {
				if(err)
					{
						console.log("Cannot find the data");
					}
				else
				{
					res.render("show.ejs",{data:data});	
				}
			})
})

//edit 
app.get("/blogs/:id/edit",function(req,res)
	   {
		entry.findById(req.params.id,function(err,data)
					  {
			if(err)
			{
				console.log("Could not find the data");
			}
			else
			{
			res.render("edit.ejs",{data:data});	
			}
		});
});
//update
app.put("/blogs/:id",function(req,res)
	   {
			req.body.blog.body = req.sanitize(req.body.blog.body);
			entry.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updata)
								   {
				if(err)
					{
						console.log("Cannot find updated data");
					}
				else
				{
					res.render("show.ejs",{data:updata});	
				}
			})
});
//delete
app.delete("/blogs/:id",function(req,res)
		  {
				entry.findByIdAndRemove(req.params.id,function(err)
									   {
					if(err)
						{
							console.log("Could not delete data");
						}
					else{
						res.redirect("/blogs");
					}
				})
	
})
app.listen(process.env.PORT||3000,process.env.IP,function()
		  {
	console.log("Blog app has started!!");
})