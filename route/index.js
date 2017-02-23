var router=require('express').Router();
	router.use('/api',require('./api'));
	router.use('/site',require('./site'));
module.exports=router;