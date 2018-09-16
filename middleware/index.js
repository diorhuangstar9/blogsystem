
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req,res,next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You have to be logged in to do that.");
    res.redirect("/login");
}

module.exports = middlewareObj;