const express=require('express'),
router=express.Router();

router.use('/todo',require('./todoRoute.js'));
router.use('/user',require('./userRoute.js'));

module.exports=router;