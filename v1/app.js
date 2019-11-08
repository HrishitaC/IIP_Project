var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    User            = require("./models/users"),
    Voter            = require("./models/voters");

var indexRoutes     = require("./routes/index");

mongoose.connect("mongodb://localhost/IIP_Project");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

//=====================
//   PASSPORT CONFIG
//=====================
app.use(require("express-session")({
    secret: "IIPProject",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//===================================
//Passing user details to all routes
//===================================

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

//======================
//   REQUIRING ROUTES
//======================
app.use("/", indexRoutes);

app.listen(3000, function(){
    console.log("IIP server has started!");
});


