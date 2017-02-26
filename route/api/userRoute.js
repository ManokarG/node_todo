const express=require('express');
const _=require('underscore');
const User=require('./../../models/user.js');
const Token=require('./../../models/token.js');
const middleware=require('./../../util/middleware.js')();
const mailer=require('./../../util/mail.js')();
const router=express.Router();
var isMailRequired=false;
	
	// route middleware that will happen on every request
	router.use(function(req, res, next) {
		console.log("User Route Detected");
	    // continue doing what we were doing and go to the route
	    next(); 
	});

router.get('/:id',function(req,res){
	User.findOne({
		_id:req.params.id
	}).then(function(user){
		res.json({
					status:'success',
					user:user.toPublicJSON()
				})
	},function(err){
		res.json({
					status:'err',
					message:'User not found'
				})
	})
})

	router.get('/',function(req,res){
		User.find().then(function(users){
				res.json({
					status:'success',
					users:users
				})
		},function(err){
			res.json({
					status:'error',
					message:'Cannot find users'
				})
		})
	})

	router.post('/authenticate',middleware.requireAuthentication,function(req,res){
		res.json({
			status:'success',
			message:'user authenticated successfully',
			user:req.user

		})
	})

	router.post('/update',function(req,res){

	})

	router.post('/login',function(req,res){

		var userPicked=_.pick(req.body,'email','password');
		User.authenticate(userPicked)
		.then(function(user){
			var token=new Token({
			token:user.generateToken('authenticate')	
			});
			token.save().then(function(token){
				res.header('token',token.token).json({
					status:'success',
					message:'user logged in',
					user:user.toPublicJSON()
				})
			},function(err){
				res.json({
				status:'error',
				message:'something went wrong on token generation'
			});
			});

		},function(err){
			res.json({
				status:'error',
				message:'username or password wrong'
			});
		});

	})

	router.post('/logout',middleware.requireAuthentication,function(req,res){
		var token=req.get('Auth');
		Token.remove({
			token:token
		}).then(function(){
			res.json({
			status:'success',
			message:'User logged out successfully'
			})
		},function(err){
			res.json({
			status:'error',
			message:'User login not found'
			})
		})
	})

	router.post('/changepassword',middleware.requireAuthentication,function(req,res){
		console.log(req.user);
		if(req.body.oldpassword!==req.user.password){
			res.json({
			status:'error',
			message:'old password is wrong'
			})
			return;
		}
		User.findOneAndUpdate({
			_id:req.user._id
		},{
			$set:{
				password:req.body.password
			}
		},{
			new:true
		}).then(function(user){
			res.json({
			status:'success',
			message:'Password changed successfully',
			user:user.toPublicJSON()
			})
		},function(err){
			res.json({
			status:'error',
			message:'cannot update password'
			})
		})
	})

	router.post('/forgotpassword',function(req,res){
		if(!req.contains('email')){
			res.sendFailure({
				message:'Please provide email'
			});
			return;
		}

		User.findOne({
			email:req.body.email
		},function(err,user){

			if(err||!user){
				res.sendFailure({
					message:'No user found'
				})
				return;
			}

			if(isMailRequired){

				mailer.sendMail({
				from:'no-reply@gmail.com',
				to:user.email,
				subject:'Forgot Password',
				html:`<p>Hi, </br></br> <p>your password is <h3>${user.password}</h3></p></p>`
				},function(err,info){
					if(err){
					res.sendFailure({
					message:'Cannot send mail'
					})
					}else{
					res.sendSuccess({
						message:'Password send to your email successfully'
					})
					}
					
				});

			}else{
				res.sendSuccess({
						message:'Password send to your email successfully'
					})
			}

		});

	})

	router.post('/',function(req,res){
		if(!req.contains('email')){
			res.sendFailure({
				message:'Please provide email'
			});
			return;
		}

		if(!req.body.password){
			res.sendFailure({
				message:'Please enter password'
			});
			return;
		}

		console.log(req.body);
		var userPicked=_.pick(req.body,'email','password');
		console.log(userPicked);

		User.findOne({
			email:userPicked.email
		}).then(function(user){
			if(user){
			res.sendFailure({
				message:'Email already exist'
			})
		}else{
			createUser(userPicked,res);
		}
		},function(err){
			createUser(userPicked);
		})

	})

	function createUser(userPicked,res){
			var user=new User(userPicked);
			user.save().then(function(user){
				if(isMailRequired){

				mailer.sendMail({
				from:'no-reply@gmail.com',
				to:user.email,
				subject:'User created successfully',
				html:`<p>Hi, </br> your notez account has been successfully created.</br> your password is <h3>${user.password}</h3><p>`
				},function(err,info){
					if (err) {
						res.sendFailure({
							message:'mail not send'
						})
        				return console.log(err);
    				}

					res.sendSuccess({
							user:user.toPublicJSON()
						});
				})

				}else{

				res.sendSuccess({
							user:user.toPublicJSON()
						});	

				}
				
			},function(err){

					res.sendFailure({
						message:err
					});

			});
}

module.exports=router;