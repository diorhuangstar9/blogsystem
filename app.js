var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    expressSanitizer = require('express-sanitizer'),
    mongoose = require("mongoose"),
    passport = require("passport"),
    flash = require("connect-flash"),
    methodOverride = require("method-override"),
    localStrategy = require("passport-local");

var Blog = require("./models/blogs");
var User = require("./models/user");
    
var indexRoutes = require("./routes/index");
var blogRoutes = require("./routes/blogs");
var commentRoutes = require("./routes/comments");
var imageRoutes = require("./routes/images");
var url = process.env.DATABASEURL || "mongodb://localhost:27017/blog_system";
mongoose.connect(url,{ useNewUrlParser: true });

// seedDB();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/node_modules/tinymce"));
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(require("express-session")({
    secret:"Dior is awesome",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});
app.use(methodOverride("_method"));

app.use(indexRoutes);
app.use("/blogs", blogRoutes);
app.use("/images", imageRoutes);
app.use("/blogs/:id/comments", commentRoutes);

var userData = {username:"diorhuang", password:"12345"};
var blogData = [
    {
        title:"第一次写博客",
        content:"第一次写博客的感受",
        createdTime:"2018/08/20"
    },
    {
        title:"开始熟门熟路",
        content:"开始熟门熟路的具体感受",
        createdTime:"2018/04/20"
    }];

function seedDB() {
    Blog.remove({}, function(err) {
        if(err) {
            console.log(err);
        }
        User.find({username:"diorhuang"}, function(err, foundUser) {
            if(err) {
                console.log(err);
            }
            if (foundUser && foundUser.length > 0) {
                createBlogData(blogData, foundUser[0]);
            } else {
                User.create(userData, function(err, createdUser) {
                    if(err) {
                        console.log(err);
                    }
                    createBlogData(blogData, createdUser);
                });
            }
        });
    });
}

function createBlogData(data, user) {
    data.forEach(function(b) {
        var author = {
            id :user._id,
            username:user.username
        };
        b.author = author;
        Blog.create(b, function(err, createdBlog) {
            if(err) {
                console.log(err);
            }
        });
    });
}

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Blog System has started!!");
});