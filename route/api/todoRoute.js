module.exports=function(router){

const Todo=require('./../../models/todo.js');

router.get('/',function(req,res){
	Todo.find(function(error,todos){
		return res.json(todos);
	});
})

router.post('/',function(req,res){
	Todo.create(req.body,function(err,todo){
		if(err){
			res.send('Cannot create todo');
		}else{
			res.json(todo);
		}
	});
});

router.post('/update',function(req,res){
	Todo.findByIdAndUpdate(req.body.id,req.body,function(err,todo){
		if(err){
			res.send('Cannot update todo');
		}else{
			Todo.findOne({
				_id:req.body.id
			},function(err,todo){
				res.json(todo);
			})
		}
	})
})


return router;
};