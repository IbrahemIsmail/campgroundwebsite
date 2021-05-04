const middlewareObj = {},
	  Camp          = require("../models/campgrounds"),
	  Comment       = require("../models/comments");

middlewareObj.authUser = function(req, res, next){
	if(req.isAuthenticated()){
		Camp.findById(req.params.id, function(err, foundCamp){
		if(err || !foundCamp){
			req.flash("error", "Campground Not Found");
			res.redirect("back");
		}
		else{
			if(foundCamp.author.id.equals(req.user._id)){
			   next();
			   } else{
				   req.flash("error", "You Don't Have Permission To Do That");
				   res.redirect("back");
			   }	
		}
	});
	} else{
		req.flash("error", "Please Log In First");
		res.redirect("back");
	}
}

middlewareObj.authComment = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.commentId, function(err, found){
		if(err || !found){
			req.flash("error", "Comment Not Found");
			res.redirect("back");
		}
		else{
			if(found.author.id.equals(req.user._id)){
			   next();
			   } else{
				   req.flash("error", "You Don't Have Permission To Do That");
				   res.redirect("back");
			   }	
		}
	});
	} else{
		req.flash("error", "Please Log In First");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please Log In First");
	res.redirect("/login")
}

module.exports = middlewareObj;