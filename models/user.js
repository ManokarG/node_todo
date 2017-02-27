const mongoose=require('mongoose');
const SchemaPlugin=require('./../util/schemaplugin.js');
const bcrypt = require('bcryptjs');
const crypto = require('crypto-js');
const _ = require('underscore');
const jwt = require('jsonwebtoken');
mongoose.Promise = require('bluebird');

const userSchema=new mongoose.Schema({
	email:{
		required:[true,'email required'],
		type:String,
		unique:[true,'user already exist'],
		set:setLower
	},
	password:{
		required:[true,'password required'],
		type:String
	},
	salt:{
		required:[true,'salt required'],
		type:String,
		select:false
	},
	passwordHash:{
		required:[true,'password hash required'],
		type:String
	},
	createdAt:{
		type:Date,
		default:Date.now
	},
	updatedAt:{
		type:Date,
		default:Date.now
	}
},{
 versionKey: false 
})

userSchema.plugin(SchemaPlugin);

function setLower(email){
return email.toLowerCase();
}
// assign a function to the "methods" object of our animalSchema
userSchema.methods.toPublicJSON = function() {
	var json=this.toJSON();
	var data=_.pick(json,'email','password','createdDate','updatedDate');
	data['id']=json._id;
  	return data;
};

userSchema.methods.generateToken=function(type) {
				if (!_.isString(type)) {
					return undefined;
				}

				try {
					var jsonData = JSON.stringify({
						id: this._id,
						type: type
					});
					var encryptedData = crypto.AES.encrypt(jsonData, process.env.SESSION_SECRET).toString();
					var token = jwt.sign({
						token: encryptedData
					}, process.env.SESSION_SECRET);
					return token;
				} catch (e) {
					console.log(e);
					return undefined;
				}
			}

userSchema.post('save',function(){
	console.log("Post save user");
})

userSchema.pre('validate',function(next){
		console.log('Pre validate called');
		var salt = bcrypt.genSaltSync(10);
		this.passwordHash = bcrypt.hashSync(this.password, salt);
		this.salt=salt;
		next();
})

userSchema.statics.findByToken=function(token,cb){
	jwt.verify(token,process.env.SESSION_SECRET,function(err,decodeJwt){
		if(err){
			console.log('Token verify failure');
			cb(err);
		}else if(!decodeJwt){
			console.log('Token verify unknown');
			cb(new Error('invalid token'));
		}else{

		console.log('token verify success');

		var bytes=crypto.AES.decrypt(decodeJwt.token,process.env.SESSION_SECRET);
		var tokenData=JSON.parse(bytes.toString(crypto.enc.Utf8));

		User.findById(tokenData.id,function(err,user){
			if(err||!user){
				console.log('User find failure');
				cb(new Error('Cannot find user'))
			}else{
				console.log('User find success '+user);
				cb(null,user);
			}
		});

		}

	});
}

userSchema.statics.authenticate=function(body) {
				return new Promise(function(resolve, reject) {
					if (typeof body.email != 'string' || typeof body.password != 'string') {
						return reject();
					}

					User.findOne({
							email: body.email
						}).then(function(user) {
						if (!user || !bcrypt.compareSync(body.password, user.passwordHash)) {
							return reject();
						}

						resolve(user);
					}, function(e) {
						reject();
					});

				});
			}

const User=mongoose.model('User',userSchema,'user');

module.exports=User;