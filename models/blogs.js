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
    },
    comments: [
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }   
    ],
});

module.exports = mongoose.model("Blog", BlogSchema);