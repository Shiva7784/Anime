import mongoose from "mongoose";

const ListSchema = new mongoose.Schema({
    userid : {type : String , required : true},
    movieid : {type : String , required: true},
    moviename : {type: String , required : true},
    imageurl : {type : String , required : true},
    language : {type : String , required : true},

})

const Listmodel = mongoose.model("WatchList",ListSchema);

export default Listmodel;