const express=require('express'),
router=express.Router();

router.get('/todo',function(req,res){
	res.sendFile(__dirname+'/public/html/todo.html');
});

module.exports=router;