const express              = require("express"),
      app                   = express(),
      axios                 = require('axios'),
      bodyParser            = require("body-parser"),
	  moment                = require("moment"),
      mongoose              = require("mongoose"),
	  User                  = require("./models/user"),
	  Camp                  = require("./models/campgrounds"),
	  Comment               = require("./models/comments"),
	  seedDb                = require("./seeds"),
	  flash                 = require("connect-flash"),
	  passport              = require("passport"),
	  localStrategy         = require("passport-local"),
	  methodOverride        = require("method-override"),
	  passportLocalMongoose = require("passport-local-mongoose");
	   

const campgroundRoutes = require("./routes/campgrounds"),
	  commentRoutes    = require("./routes/comments"),
	  indexRoutes      = require("./routes/index");

mongoose.connect('mongodb://localhost:27017/yelpCamp11', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));
// seedDb();

app.locals.moment = require('moment');
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
	secret: "cunt",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currUser = req.user;
	res.locals.error    = req.flash("error");
	res.locals.success  = req.flash("success");
	next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/id=:id/comments", commentRoutes);
app.use(indexRoutes);

app.listen(3000, function(){
	console.log("server is up and running");
});






