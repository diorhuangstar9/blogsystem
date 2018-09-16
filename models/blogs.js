var mongoose = require("mongoose");

var BlogSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    createdTime: {
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model("Blog", BlogSchema);