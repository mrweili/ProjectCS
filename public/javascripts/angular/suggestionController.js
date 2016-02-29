angular
	.module("projectcs.suggestioncontroller", [])
	.controller('suggestionController', ['$scope', 'CourseService', function($scope, CourseService) {
		var username = 'courseTest';
		var questions = {
			'Do you like to do a lot of writing?': ['CSC200Y1', 'CSC300H1', 'CSC318H1'],
			'Do you enjoy doing math?': ['CSC336H1', 'CSC446H1', 'CSC466H1'],
			'Are you interested in theory courses?': ['CSC373H1', 'CSC448H1', 'CSC463H1'],
			'Are you interested in knowing about databases?': ['CSC343H1', 'CSC443H1'],
			'Do you want to know more about computer hardware?': ['CSC258H1', 'CSC372H1']
		}

		function hasTakenPrereq(a, b) {
			for (var i = 0; i < a.length; i++) {
				for (var j = 0; j < b.length; j++) {
					if (a[i] === b[j]) {
						return true;
					}
				}
			}
			return false;
		}

		function getTakenPrereqs(prereqs) {
			var result = [];
			for (var i = 0; i < prereqs.length; i++) {
				var multiple = prereqs[i].split('/');
				result.push({ courses: prereqs[i], taken: hasTakenPrereq(multiple, $scope.coursesTaken)});
			}
			return result;
		}

		$scope.submit = function() {
			$scope.suggestions = [];
			$scope.checked = true;
			for (var question in $scope.formData) {
				if ($scope.formData[question]) {
					for (var i = 0; i < questions[question].length; i++) {
						CourseService.getCourse.get({cid: questions[question][i]}, function(result) {
							if ($scope.coursesTaken.indexOf(result.courseID) === -1) {
								if (result.prereqs.length === 0) {
									result.prereqs = [];
								} else {
									result.prereqs = getTakenPrereqs(result.prereqs);
								}
								$scope.suggestions.push(result);	
							}
						});
					}
				}
			}
		}

		$scope.loadQuestions = function() {
			CourseService.userCourses.query({user: username}, function(courses) {
				$scope.coursesTaken = [];
				for (var i = 0; i < courses.length; i++) {
					$scope.coursesTaken.push(courses[i].courseID);
				}
				$scope.checked = false;
				$scope.added = false;
				$scope.questions = Object.keys(questions);
				$scope.formData = {};
				for (var question in questions) {
					$scope.formData[question] = true;
				}
			});
		}

		$scope.loadQuestions();
	}]);
