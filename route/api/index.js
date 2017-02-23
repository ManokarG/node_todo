const express=require('express');
const router=express.Router();
	router.use('/todo',require('./todoRoute.js'));
	router.use('/user',require('./userRoute.js'));
module.exports=router;