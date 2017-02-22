module.exports=function(router){
	router.use('/api',require('./api')(router));
	router.use('/site',require('./site')(router));
	return router;
}