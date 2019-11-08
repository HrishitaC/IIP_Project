var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

middlewareObj.hasVoted = function(req, res, next){
    if(req.user.voted){
        res.render("alreadyVoted");
    } 
    else {
        next();
    }
}

module.exports = middlewareObj;