module.exports=function(router){
	router.get('/todo',function(req,res){
	res.sendFile(__dirname+'/public/html/todo.html');
});
	return router;
};