var router=require('express').Router();
const Todo=require('./../models/todo.js');
const middleware=require('./../util/middleware.js')();

router.use('/api',require('./api'));
router.get('/login',function(req,res){
    res.render('login',{

    });
});

router.get('/register',function(req,res){
    res.render('register',{

    });
});

router.get('/forgotpassword',function(req,res){
  res.render('forgotpassword',{});
});

router.get('/dashboard',middleware.requireAuthentication,function(req,res){
    Todo.find({
        user:req.user._id
    },function(err,todos){
        if(err||!todos){
            res.render('dashboard',{
                todos:null
            });
        }else{
            res.render('dashboard',{
                todos:todos
            });
        }

    });
})

module.exports=router;