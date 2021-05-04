const mongoose= require("mongoose");
const campSchema=new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String,
	created: {type: Date, default: Date.now},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

module.exports =mongoose.model("Camp", campSchema);