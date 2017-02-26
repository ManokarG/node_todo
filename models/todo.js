const mongoose=require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');
const _ = require('underscore');
const SchemaPlugin=require('./../util/schemaplugin.js');

const TodoSchema=new mongoose.Schema({
	title:{
		required:true,
		type:String
	},
	description:{
		required:true,
		type:String
	},
	completed:{
		type:Boolean,
		required:true,
		default:function(){
			return false;
		}
	},
	user: {
		type:Schema.Types.ObjectId,
		 ref:'users'
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
},{
 versionKey: false 
})

TodoSchema.plugin(SchemaPlugin);

TodoSchema.methods.toPublicJSON=function(){
	var data=this.toJSON();
	var todo=_.pick(data,'description','title','completed');
	todo['id']=data._id;
	return todo;
}
TodoSchema.post('save',function(){
	console.log("Todo create after");
})

TodoSchema.pre('save',function(next){
	console.log("Todo create before");
	next();
})

const Todo=mongoose.model('Todo',TodoSchema,'todo');

module.exports=Todo;