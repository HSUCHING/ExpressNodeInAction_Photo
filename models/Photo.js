/**
 * Created by i068959 on 15/10/4.
 */
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/photo_app');
var schema=new mongoose.Schema({
	name:String,
	path:String
});
module.exports=mongoose.model('Photo',schema);