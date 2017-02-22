const mongoose=require('mongoose');

const TodoSchema=new mongoose.Schema({
	content:{
		required:true,
		type:String
	},
	description:{
		required:true,
		type:String
	}
})

TodoSchema.post('save',function(){
	console.log("Todo create after");

});

TodoSchema.pre('save',function(next){
	console.log("Todo create before");
	next();
})

const Todo=mongoose.model('Todo',TodoSchema);

module.exports=Todo;