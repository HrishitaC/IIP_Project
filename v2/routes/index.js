var express         = require("express");
var router = express.Router({mergeParams: true});
var passport        = require("passport");
var User            = require("../models/users"),
    Voter            = require("../models/voters"),
    middleware      = require("../middleware");

//============
//LANDING PAGE
//============
router.get("/", function(req, res){
    Voter.find({}, function(err, allParties){
        if(err){
            console.log(err);
        } else {
            res.render("IIP", {parties: allParties});
        }
    });
});

router.get("/IIP", function(req, res){
    Voter.find({}, function(err, allParties){
        if(err){
            console.log(err);
        } else {
            res.render("IIP", {parties: allParties})
        }
    });
});


//=============================
//      AUTH ROUTES
//=============================

//show register form
router.get("/register", function(req, res){
    res.render("users/register")
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username, aadhar: req.body.aadhar, voted: false});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.render("users/register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/");
            });
        }
    });
});

//show login form
router.get("/login", function(req, res){
    res.render("users/login");
});


//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/IIP",
        failureRedirect: "/register",
    }), function(req, res){
});

//logout route
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

//==============
// VOTING ROUTE
//==============

router.post("/aadhar", middleware.isLoggedIn, function(req, res){
    if(req.user.aadhar == req.body.number){
        Voter.find({}, function(err, allParties){
            res.render("vote", {parties: allParties});
        });
    } else {
        Voter.find({}, function(err, allParties){
            if(err){
                console.log(err);
            } else {
                res.redirect("/register");
            }
        })

    }
})

router.post("/vote", middleware.isLoggedIn, middleware.hasVoted, function(req, res){
    Voter.findById(req.body.vote, function(err, foundParty){
        if(err){
            console.log(err);
        } else {
            User.findById(req.user._id, function(err, foundUser){
                if(err){
                    console.log(err)
                } else {
                    foundUser.voted = true;
                    foundUser.save();
                    foundParty.votes = foundParty.votes + 1;
                    foundParty.save();
                    res.render("success");
                }
            });
        }
    });
});

module.exports = router;