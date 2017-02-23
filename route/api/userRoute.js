const express=require('express');
const router=express.Router();
	
	// route middleware that will happen on every request
router.use(function(req, res, next) {
	console.log("User Route Detected");
    // continue doing what we were doing and go to the route
    next(); 
});

	router.get('/',function(req,res){
		console.log("Something went wrong");
		res.json({
		users:[]
		});
	})

	router.post('/:id',function(req,res){
		
	});

module.exports=router;