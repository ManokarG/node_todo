const express=require('express');
const router=express.Router();
const Todo=require('./../../models/todo.js');
const middleware=require('./../../util/middleware.js')();

// route middleware that will happen on every request
router.use(function(req, res, next) {
    // todo middleware
    next(); 
});

router.get('/:id',middleware.requireAuthentication,function(req,res){
	Todo.find({
		user:req.user._id,
		_id:req.params.id
	},function(err,todo){
		if(err||!todo){
			res.sendFailure({
			message:'No todo found'
		})
		}else{
		res.sendSuccess({
			todos:todo
		})
		}
	});
})
router.get('/',middleware.requireAuthentication,function(req,res){
	Todo.find({
		user:req.user._id
	}).then(function(todos){
		res.sendSuccess({
			todos:todos
		})
	},function(err){
		res.sendFailure({
			message:'cannot retrieve todos'
		})
	})
})

router.post('/',middleware.requireAuthentication,function(req,res){
	
	var todo=new Todo(req.body);
	todo['user']=req.user._id;
	todo.save()
	.then(function(todo){
		res.sendSuccess({
			message:'todo created successfully',
			todo:todo.toPublicJSON()
		})
	},function(err){
		res.sendFailure({
			message:'Cannot created todo'
		})
	})
});

router.post('/completed',middleware.requireAuthentication,function(req,res){

Todo.findOneAndUpdate({
		user:req.user._id,
		_id:req.body.id
	},{
		$set:{
			completed:true
		}
	},{
		new:true
	},function(err,todo){
		if(err||!todo){
			res.sendFailure({
				message:'Cannot update todo'
			})
		}else{
				res.sendSuccess({
					todo:todo
				})
		}
	})

});

router.post('/delete',middleware.requireAuthentication,function(req,res){
	Todo.findOneAndRemove({
		user:req.user._id,
		_id:req.body.id
	},function(err){
		if(err){
			res.sendFailure({
				message:'Cannot remove todo'
			})
		}else{
				res.sendSuccess({
					message:'Todo removed successfully'
				})
		}
	})
})

router.post('/update',middleware.requireAuthentication,function(req,res){

	var updateFields={};
	if(req.contains('description')){
		updateFields.description=req.body.description;
	}

	if(req.contains('title')){
		updateFields.title=req.body.title;
	}

	if(req.contains('completed')){
		updateFields.completed=req.body.completed;
	}

	Todo.findOneAndUpdate({
		user:req.user._id,
		_id:req.body.id
	},{
		$set:updateFields
	},{
		new:true
	},function(err,todo){
		if(err||!todo){
			res.sendFailure({
				message:'Cannot update todo'
			});
		}else{
				res.sendSuccess({
					todo:todo
				})
		}
	})
})

module.exports=router;