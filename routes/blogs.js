var express = require("express");
var router = express.Router();
var Blog = require("../models/blogs");
var middleware = require("../middleware");

router.get("/", function(req, res) {
    Blog.find({}, function(err,allBlogs){
        if(err) {
            console.log(err);
        } else {
            res.render("blogs/index", {blogs:allBlogs});
        }
    });
});

router.get("/new", middleware.isLoggedIn ,function(req, res) {
    res.render("blogs/new");
});

router.get("/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            console.log(err);
        } else {
            res.render("blogs/show", {blog:foundBlog});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
    // get the user from session
    req.body.blog.author = {
        id:req.user._id,
        username:req.user.username
    }
    Blog.create(req.body.blog, function(err, createdBlog) {
        if(err) {
            req.flash("error", err);
        } else {
            res.redirect("/blogs");
        }
    });
});


module.exports = router;