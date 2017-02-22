const express=require('express'),
router=express.Router();

router.get('/',function(req,res){
	res.json({
		users:[]
	});
})

module.exports=router;