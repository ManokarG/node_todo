module.exports=function(router){
	router.get('/',function(req,res){
	res.json({
		users:[]
	});
})
	return router;
};