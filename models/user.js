var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Course = require('./course');

var UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	courses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}]

});

UserSchema.statics.getAllUsers = function(callback) {
	this.find({}, function(err, users) {
		if (err) {
			callback(err, users);
		} else {
			callback(null, users);
		}
	});
}

UserSchema.statics.getUser = function(u, callback) {
	this.findOne({ username : u }, function(err, user) {
		if (err) {
			callback(err, user);
		} else {
			callback(null, user);
		}
	});
}

UserSchema.statics.getCourses = function (username, callback) {
	this
	.findOne({ username: username})
	.populate('courses')
	.exec(function (err, user){
		if (err){
			callback(err, user.courses);
		} else{
			callback(null, user.courses);
		}
	})
};

var takenPrereq = function (courses, prereq){
	if (courses.indexOf(prereq) !== -1){
		return true;
	}else{
		if (prereq.indexOf('/') !== -1){
			var filter = /CSC[0-9]*[H|Y]1/g;
			var parsedPrereq = prereq.match(filter);
			if (parsedPrereq != null && parsedPrereq.length !== 0){
				for (var i = 0; i < parsedPrereq.length; i++){
					if (courses.indexOf(parsedPrereq[i]) !== -1)
						return true;
				}
			}
		}
		return false;
	}
}

var takenAllPrereqs = function (courses, prereqs){
	return prereqs.every(function (prereq){
		return takenPrereq(courses, prereq);
	});
}

UserSchema.statics.getAvailableCourses = function (username, callback){
	this
	.getCourses(username, function (err, courses){
		if (err){ 
			callback(err, null);
		} else{
			var currentCourses = [];
			courses.forEach(function (course){
				currentCourses.push(course.courseID);
			});
			Course.getAllCourses(function (err, allCourses){
				if (err){
					callback(err, null);
				} else{
					var availableCourses = [];
					allCourses.forEach(function (course){
						// Has not taken the course and has prereqs
						if (currentCourses.indexOf(course.courseID) == -1){
							if (course.prereqs.length === 0){
								availableCourses.push(course);
							}else if (takenAllPrereqs(currentCourses, course.prereqs)){
									availableCourses.push(course);
							}
						}
					});
					callback(null, availableCourses);
				}
			});
		}
	});
};

UserSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};
UserSchema.methods.isValidPassword = function(password){
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
