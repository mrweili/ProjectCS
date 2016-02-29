var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
	courseID: String,
	description: String,
	exclusions: [String],
	prereqs: [String]
});

CourseSchema.statics.getAllCourses = function(callback) {
	this.find({}, function(err, courses) {
		if (err) {
			callback(err, courses);
		} else {
			callback(null, courses);
		}
	});
}

CourseSchema.statics.getCourse = function(c, callback) {
	this.findOne({ courseID : c }, function(err, course) {
		if (err) {
			callback(err, course);
		} else {
			callback(null, course);
		}
	});
}

CourseSchema.statics.get100LvlCourses = function(callback) {
	this.find({}, function(err, courses) {
		if (err) {
			callback(err, courses);
		} else {
			callback(null, courses.filter(function(e) {
				return /^CSC1\d\dH1$/.test(e.courseID);
			}));
		}
	});
}


CourseSchema.statics.get200LvlCourses = function(callback) {
	this.find({}, function(err, courses) {
		if (err) {
			callback(err, courses);
		} else {
			callback(null, courses.filter(function(e) {
				return /^CSC2\d\dH1$/.test(e.courseID);
			}));
		}
	});
}


CourseSchema.statics.get300LvlCourses = function(callback) {
	this.find({}, function(err, courses) {
		if (err) {
			callback(err, courses);
		} else {
			callback(null, courses.filter(function(e) {
				return /^CSC3\d\dH1$/.test(e.courseID);
			}));
		}
	});
}


CourseSchema.statics.get400LvlCourses = function(callback) {
	this.find({}, function(err, courses) {
		if (err) {
			callback(err, courses);
		} else {
			callback(null, courses.filter(function(e) {
				return /^CSC4\d\dH1$/.test(e.courseID);
			}));
		}
	});
}

module.exports = mongoose.model('Course', CourseSchema);
