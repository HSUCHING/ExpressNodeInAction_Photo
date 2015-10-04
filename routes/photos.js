/**
 * Created by i068959 on 15/10/3.
 */
var express = require('express');
var router = express.Router();
var Photo=require('../models/Photo');
var multipart = require('connect-multiparty');
var path=require('path');
var fs=require('fs');
var join=path.join;
var photos=[];
photos.push({
	name:'Node.js Logo',
	path:'http://www.html5china.com/uploads/allimg/111218/161PC4H-1.png'
});

photos.push({
	name:'Ryan Creator',
	path:'http://htmljs.b0.upaiyun.com/uploads/1398391371178-0%20%282%29.jpg'
});

var multipartMiddleware = multipart();
function photo(path){
	//router.get('/', function(req, res, next){
	//	res.render('photos',{
	//		title:'Photos',
	//		photos:photos
	//	});
	//});

	router.get('/', function(req, res, next){
		Photo.remove({name:'lo'},function(error){
			if(error){
				console.log(error);
			}else{
				console.log('delete ok!');
			}
		});
		Photo.find({},function(err,photos){
			if(err) return next(err);
			res.render('photos',{
				title:'Photos',
				photos:photos
			});
		});
	});

	var form=function(req,res){
		res.render('photos/upload',{
			title:'Photo upload'
		});
	};
	var submit=function(dir){
		return function(req,res,next){
			var img=req.files.photo.image;
			var name =req.body.photo.name||img.name;
			//var path=join(dir,img.name);
			var path=join(dir,name)+img.name.substr(img.name.lastIndexOf('.'));
			fs.rename(img.path,path, function (err) {
				if(err){
					return next(err);
				}
				Photo.create({
					name:name,
					//path:img.name
					path:name+img.name.substr(img.name.lastIndexOf('.'))
				},function(err){
					if(err){
						return next(err);
					}
					res.redirect('/');
				});
			});
		};
	};

	var download=function(dir){
		return function(req,res,next){
			var id=req.params.id;
			Photo.findById(id,function(err,photo){
				if(err) return next(err);
				var path=join(dir,photo.path);
				//res.sendfile(path,function(){
				//	console.log("download is ok");
				//});
				res.download(path,"photo_"+photo.name+'.jpeg');
			});
		};
	};


	router.get('/upload', form);
	router.get('/images/:id/download', download(path));
	router.post('/upload', multipartMiddleware, submit(path));
	return router;
};


module.exports = photo;