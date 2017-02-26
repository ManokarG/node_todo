const mongoose=require('mongoose');
mongoose.Promise = require('bluebird');
const SchemaPlugin=require('./../util/schemaplugin.js');

var TokenSchema=new mongoose.Schema({
	token:{
		required:true,
		type:String
	},
	createdAt:{
		type:Date,
		required:true,
		default:Date.now
	},
	updatedAt:{
		type:Date,
		required:true,
		default:Date.now
	}
})

TokenSchema.plugin(SchemaPlugin);

TokenSchema.post('save',function(){
	console.log("Todo create after");

})

TokenSchema.pre('save',function(next){
	console.log("Todo create before");
	next();
})

const Token=mongoose.model('Token',TokenSchema,'token');

module.exports=Token;