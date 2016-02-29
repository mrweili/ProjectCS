var Course = require('../models/course.js');
var User = require('../models/user.js');
var express = require('express');
var router = express.Router();

router.get('/:cid', function(req, res) {
	Course.findOne({courseID: req.params.cid}, function(err, course) {
		if (err) res.send(err);
	 	res.send(course);
	 });
});

router.get('/level/:level', function(req, res) {
	if (req.params.level === '100') {
		Course.get100LvlCourses(function(err, courses){
			if (err) res.send(err);
			res.send(courses);
		});
	} else if (req.params.level === '200') {
		Course.get200LvlCourses(function(err, courses){
			if (err) res.send(err);
			res.send(courses);
		});
	} else if (req.params.level === '300') {
		Course.get300LvlCourses(function(err, courses){
			if (err) res.send(err);
			res.send(courses);
		});
	} else if (req.params.level === '400') {
		Course.get400LvlCourses(function(err, courses){
			if (err) res.send(err);
			res.send(courses);
		});
	} else {
		res.send({});
	}
});

module.exports = router;
