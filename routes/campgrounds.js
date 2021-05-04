const express = require("express"),
	  router  = express.Router(),
	  mw      = require("../middleware"),
	  Camp    = require("../models/campgrounds");

router.get("/", function(req, res){
	Camp.find({}, function(err, allCamps){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/index", {camps: allCamps});
		}
	});
});
router.get("/id=:id", function(req, res){
	Camp.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
		if(err || !foundCamp){
			req.flash("error", "Campground Not Found");
			return res.redirect("back");
		}
		else{
			res.render("campgrounds/show", {camp: foundCamp});
		}
	});
});
router.get("/new", mw.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});
router.post("/", mw.isLoggedIn, function(req, res){
	const name        = req.body.name,
	      image       = req.body.image,
		  price       = req.body.price,
	      description = req.body.description,
		  author      = {id:req.user._id,
						 username:req.user.username};
		Camp.create({
			name: name,
			image: image,
			price: price,
			description: description,
			author: author
		}, function(err, camp){
		if(err){
			console.log("Error: "+err);
		}
		else{
			res.redirect("/campgrounds");
		}
	});
});
router.get("/id=:id/edit", mw.authUser, function(req, res){
	Camp.findById(req.params.id, function(err, foundCamp){
		res.render("campgrounds/edit", {camp: foundCamp});
	});
});
router.put("/id=:id", mw.authUser, function(req, res){
	Camp.findByIdAndUpdate(req.params.id, req.body.camp,  function(err, upCamp){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds/id="+req.params.id);
		}
	});
});
router.delete("/id=:id", mw.authUser, function(req, res){
	Camp.findByIdAndRemove(req.params.id, function(err, upCamp){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			req.flash("success", "Campground Deleted");
			res.redirect("/campgrounds");
		}
	});
});




module.exports = router;


