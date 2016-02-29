var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Course = require('../models/course.js');


/* GET users listing. */

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:username', function(req, res, next){
	User.getUser(req.params.username, function (err, user){
		if (err) next(err);
		res.json(user);
	});
});

router.get('/:username/courses', function (req, res, next){
	User.getCourses(req.params.username, function (err, courses){
		if (err) next(err);
		res.json(courses);
	});
});

router.post('/:username/courses', function (req, res, next){
	User.getUser(req.params.username, function (err, user){
		if (err) next(err);
		Course.getCourse(req.body.course, function (err, course){ 
			if (err) next(err);
			if (user.courses.indexOf(course._id) == -1){
				user.courses.push(course._id);
				user.save();
			}
			res.json(user);	
		});
	});
});

router.delete('/:username/courses/:courseID', function (req, res, next){
	User.getUser(req.params.username, function (err, user){
		if (err) next(err);
		Course.getCourse(req.params.courseID, function (err, course){
			if (err) next(err);
			if (user.courses.indexOf(course._id) != -1){
				user.courses.splice(user.courses.indexOf(course._id), 1);
				user.save();
			}
			res.json(user);
		});
	});
});

router.get('/:username/availableCourses', function (req, res, next){
	User.getAvailableCourses(req.params.username, function (err, courses){
		if (err) next(err);
		res.json(courses);
	});
});

router.get('/:username/availableCourses/:level', function(req, res) {
	User.getAvailableCourses(req.params.username, function (err, courses){
		if (err) next(err);
		if (req.params.level === '100') {
			res.json(courses.filter(function (e){
				return /^CSC1\d\dH1$/.test(e.courseID);
			}));
		} else if (req.params.level === '200') {
			res.json(courses.filter(function (e){
				return /^CSC2\d\dH1$/.test(e.courseID);
			}));
		} else if (req.params.level === '300') {
			res.json(courses.filter(function (e){
				return /^CSC3\d\dH1$/.test(e.courseID);
			}));
		} else if (req.params.level === '400') {
			res.json(courses.filter(function (e){
				return /^CSC4\d\dH1$/.test(e.courseID);
			}));
		} else {
			res.send({});
		}

	})
});


module.exports = router;
