const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
	email:{
		required:true,
		type:String
	},
	password:{
		required:true,
		type:String
	}
})

UserSchema.pre('save',function(next){

	next();
})

const User=mongoose.model('user',UserSchema);

module.exports=User;