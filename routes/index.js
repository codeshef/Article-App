var express=require('express');
var passport=require('passport');
var router=express.Router();
var flash=require('connect-flash');
var Post=require('../models/post');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash=require('connect-flash');
var session = require('express-session');

router.use(flash());
router.use(session({secret:'shhsecret'}));
router.use(passport.initialize());
router.use(passport.session());
router.get('/',function(req,res,next){
	res.render('home',{title:'HomePage'});
});
router.get('/index',function(req,res,next)
	{
		Post.find({}, function(err, posts) {
		res.render('index',{title:'Article App',posts:posts});
	
	});
	});
router.post('/save',function(req,res)
	{ 
		//data coming from the client  situated in the "req" object
		//we can send to the client using "res" object
		//data from client is in req.body
		var data=req.body;
		var post= new Post(data);
		//save the post
		post.save(function(err)
			{
				if(err)
				{
					return res.json(
						{
							error:true,
							message:"Unable to save the post",
							err:err
						});
				}
				// otherwise perfectly saved
				res.json({
					error:false,
					message:"Article Saved"
				});
			});

	});
// delete an article  by its id
router.get('/destroy/:id',function(req,res,next)
{
	 
    Post.findById(req.params.id,function(err,post)
		{  

			var user_id = req.cookies?
			req.cookies.user_id:undefined;
            if(post.user_id!=user_id)
            {
            	return utils.forbidden(res);
            }

			post.remove(function(err,post)
				{
					if(err)
					return next(err);
					res.redirect('/index');
				});
		});
});
// login
router.get('/login',function(req,res,next)
	{
		 res.render('login.ejs',{message: req.flash('loginMessage')});
	});
// signup
router.get('/signup',function(req,res,next)
	{
		res.render('signup.ejs',{message:req.flash('signupMessage')});
	});
// logout
router.get('/logout',function(req,res)
	{
		req.logout();
		res.redirect('/');
	});
// post request to allow the user to enter their credentials to our form.
//signup
router.post('/signup',passport.authenticate('local-signup',{
	successRedirect:'/login',
	failureRedirect:'/signup',
	failureFlash:true,
}));

//login
router.post('/login',passport.authenticate('local-login',{
	successRedirect:'/index',
	failureRedirect:'/login',
	failureFlash:true,
}));
 
module.exports=router;

function isLoggedIn(req,res,next)
{
	if(req.isAuthenticated())
		return next();
	 res.redirect('/');
}
