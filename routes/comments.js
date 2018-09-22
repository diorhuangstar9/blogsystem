var express = require("express");
var router = express.Router({mergeParams:true});
var Blog = require("../models/blogs");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req,res) {
   Blog.findById(req.params.id, function(err, blog) {
       if(err) {
           req.flash("error", err);
           res.redirect("/blog");
       } else {
           res.render("comments/new", {blog:blog});
       }
   }) 
});

router.post("/", middleware.isLoggedIn, function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if(err) {
            console.log(err);
            res.redirect("/blogs");
        } else {
            Comment.create(req.body.comment,function(err, comment) {
               if(err) {
                   req.flash("error", "Something went wrong.");
                   res.redirect("/blogs/"+blog._id);
               } else {
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();
                   blog.comments.push(comment);
                   blog.save();
                   req.flash("success", "Successfully added comment");
                   res.redirect("/blogs/"+blog._id);
               }
            });
        }
    });
});

module.exports = router;