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
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog) {
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

router.get("/:id/edit", function(req,res) {
   Blog.findById(req.params.id, function(err, foundBlog) {
      res.render("blogs/edit", {blog:foundBlog});
   });
});

router.put("/:id", function(req, res) {
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
      if(err) {
          res.redirect("/blogs");
      } else {
          res.redirect("/blogs/" + req.params.id);
      }
   });
});

router.delete("/:id", function(req,res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
       if(err) {
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs");
       }
    });
})

module.exports = router;