var express=require('express');
var router=express.Router();
var Post=require('../models/post');
router.get('/',function(req,res,next)
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
					res.redirect('/');
				});
		});
});
 
module.exports=router;
