var express= require("express");
var router =express.Router();
var User = require("../models/user");
var passport = require("passport");
var svgCaptcha = require("svg-captcha");

router.get("/", function(req, res) {
    res.redirect("/blogs");
});

router.get("/register", function(req,res) {
    res.render("register", {
        user:{
            username:req.query.username,
    }});
});

router.post("/register", validateCaptcha, function (req,res) {
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, function(err,user) {
        if(err) {
            req.flash("error", err.message);
            console.log(err);
            return res.redirect("/register?username="+req.body.username);
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/");
        });
    });
});

router.get("/login", function(req,res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect:"/",
    failureRedirect:"/login"
}), function (req,res) {
});

router.get("/logout", function(req,res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/");
});

router.get("/captcha", function(req, res) {
   var captcha = svgCaptcha.create();
   req.session.captcha = captcha.text;
   res.type("svg");
   res.status(200).send(captcha.data);
});

function validateCaptcha(req,res,next) {
    if(req.body.captcha && req.session.captcha &&
        req.body.captcha.toLowerCase() === req.session.captcha.toLowerCase())
        return next();
    req.flash("error", "wrong captcha");
    res.redirect("/register?username="+req.body.username);
}

module.exports = router;