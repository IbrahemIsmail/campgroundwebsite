const express   = require("express"),
	  router    = express.Router({mergeParams: true}),
      Camp      = require("../models/campgrounds"),
	  mw        = require("../middleware"),
	  Comment   = require("../models/comments");
	  	  


router.get("/new", mw.isLoggedIn, function(req, res){
	Camp.findById(req.params.id, function(err, foundCamp){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new", {camp: foundCamp});
		}
	});
});
router.post("/", mw.isLoggedIn, function(req, res){
	Camp.findById(req.params.id, function(err, foundCamp){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Something Went Wrong :(");
					console.log(err);
				}
				else{
					comment.author.id= req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					foundCamp.comments.push(comment);
					foundCamp.save();
					req.flash("success", "Added Comment Successfully");
			        res.redirect("/campgrounds/id="+foundCamp._id);
				}
			});
		}
	});
});
router.get("/:commentId/edit", mw.authComment, function(req, res){
	Camp.findById(req.params.id, function(err, found){
		if(err || !found){
			req.flash("error", "Campground Not Found");
			return res.redirect("back");
		}
		else{
			Comment.findById(req.params.commentId, function(err, found){
		if(err){
			res.redirect("back");
		} else{
			res.render("comments/edit", {campId: req.params.id, comment: found});
		}
	});
		}
	});
});
router.put("/:commentId", mw.authComment, function(req, res){
	Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, updated){
		if(err){
			res.redirect("back");
		} else{
			res.redirect("/campgrounds/id="+req.params.id);
		}
	});
});
router.delete("/:commentId", mw.authComment, function(req, res){
	Comment.findByIdAndRemove(req.params.commentId, function(err){
		if(err){
			res.redirect("back");
		} else{
			req.flash("success", "Comment Deleted");
			res.redirect("/campgrounds/id="+req.params.id);
		}
	});
});





module.exports = router;