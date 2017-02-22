module.exports=function(router){

router.use('/todo',require('./todoRoute.js')(router));
router.use('/user',require('./userRoute.js')(router));
return router;
};