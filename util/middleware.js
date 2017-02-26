var User=require('./../models/user.js');

function authenticate(req,res,next){
	var token=req.get('Auth');

	if(!token){
		
		console.log('Token not provided');

		res.sendFailure({
					message:'Please provide token'
				});
		return;
	}

		console.log('Token provided '+token);

		User.findByToken(token,function(err,user){

			if(err||!user){
				res.sendFailure({
					message:'Authentication failed'
				});
			}else{
				req.user=user;
				next();
			}

		});
	}

module.exports= function(){
	return {
		requireAuthentication:authenticate
	}
}