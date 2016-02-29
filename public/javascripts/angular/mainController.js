var app = angular.module('projectcs.maincontroller', []);

app.controller('mainController', ['$scope', 'CourseService',
	function($scope, CourseService) {

		var USERNAME = 'courseTest'
		var currentTab = 1;


		/* FUNCTION TO REFRESH USER COURSES */
		refreshUserCourses = function() {
			CourseService.userCourses.query({user: USERNAME},
			function(courses) {
				$scope.userCourses = courses
				courses.forEach(function(course) {
					$scope.nodes.add({id: course.courseID, label: course.courseID})
				})
				addEdges($scope.userCourses, $scope.edges)
			})

		}

		/* FUNCTION TO REFRESH AVAILABLE COURSES */
		refreshAvailableCourses = function(course) {
			CourseService.availCoursesLevel.query({user: USERNAME, level: '100'},
			function(courses){
				$scope.courses100 = courses
				index = $scope.courses100.indexOf(course); if (index > -1) $scope.courses100.splice(index,1)
				if (currentTab == 1) {setGraph2(courses); addEdges(courses, $scope.edges2)}
			})
			CourseService.availCoursesLevel.query({user: USERNAME, level: '200'},
			function(courses){
				$scope.courses200 = courses
				index = $scope.courses200.indexOf(course); if (index > -1) $scope.courses200.splice(index,1)
				if (currentTab == 2) {setGraph2(courses); addEdges(courses, $scope.edges2)}
			})
			CourseService.availCoursesLevel.query({user: USERNAME, level: '300'},
			function(courses){
				$scope.courses300 = courses
				index = $scope.courses300.indexOf(course); if (index > -1) $scope.courses300.splice(index,1)
				if (currentTab == 3) {setGraph2(courses); addEdges(courses, $scope.edges2)}
			})
			CourseService.availCoursesLevel.query({user: USERNAME, level: '400'},
			function(courses){
				$scope.courses400 = courses
				index = $scope.courses400.indexOf(course); if (index > -1) $scope.courses400.splice(index,1)
				if (currentTab == 4) {setGraph2(courses); addEdges(courses, $scope.edges2)}
			})
		}

		/* FUNCTION WHEN USER CLICK ON AVAILABLE COURSES */
		addAsCompleted = function(course) {
				console.log(course)

			// update locally
			$scope.userCourses.push(course);
			index = $scope.courses100.indexOf(course); if (index > -1) $scope.courses100.splice(index,1)
			index = $scope.courses200.indexOf(course); if (index > -1) $scope.courses200.splice(index,1)
			index = $scope.courses300.indexOf(course); if (index > -1) $scope.courses300.splice(index,1)
			index = $scope.courses400.indexOf(course); if (index > -1) $scope.courses400.splice(index,1)
			$scope.nodes.add({id:course.courseID, label:course.courseID})
			$scope.nodes2.remove({id:course.courseID})

			// update on server
			CourseService.userCourses.save({user: USERNAME, course: course.courseID},
			function(result) {
				refreshAvailableCourses(course)
			})
		}

		/* FUNCTION WHEN USER CLICK ON MY COURSES */
		addAsAvailalbe = function(course) {

			// update locally
			index = $scope.userCourses.indexOf(course); if (index > -1) $scope.userCourses.splice(index,1)
			if (course.courseID.substring(3,4) == '1') $scope.courses100.push(course)
			if (course.courseID.substring(3,4) == '2') $scope.courses200.push(course)
			if (course.courseID.substring(3,4) == '3') $scope.courses300.push(course)
			if (course.courseID.substring(3,4) == '4') $scope.courses400.push(course)
			$scope.nodes.remove({id:course.courseID})
			$scope.nodes2.add({id:course.courseID, label:course.courseID})


			// update on server
			CourseService.deleteCourse.remove({user: USERNAME, course: course.courseID},
			function(result) {
				refreshAvailableCourses();
			})
		}

		/* FUNCTION TO UPDATE GRAPH 2 NODES (AVAILALBE COURSES) */
		setGraph2 = function(courses) {
			// reset
			$scope.nodes2.forEach(function(node) {
				$scope.nodes2.remove({id: node.id})
			})
			// re-add
			courses.forEach(function(course) {
				$scope.nodes2.add({id: course.courseID, label: course.courseID})
			})
			addEdges(courses, $scope.edges2)
		}

		/* FUNCTION TO ADD EDGES TO AN EDGE SET*/
		addEdges = function(courses, edgesSet) {
			// reset
			edgesSet.forEach(function(edge) {
				edgesSet.remove({id: edge.id})
			})
			// add for each course
			courses.forEach(function(course){
	    		var prereqs = []
	    		// GET PREREQS AS A LIST OF PREREQS. why didnt alda make a api call for this!!!!
	    		course.prereqs.forEach(function(prereq){
	    			if (prereq.indexOf('/') == -1){prereqs.push(prereq)}
	    			else {
	    				var filter = /CSC[0-9]*[H|Y]1/g;
						var parsedPrereq = prereq.match(filter);
						if (parsedPrereq != null && parsedPrereq.length !== 0){
							for (var i = 0; i < parsedPrereq.length; i++){
								prereqs.push(parsedPrereq[i]);
							}
						}
	    			}
	    		})
	    		prereqs.forEach(function(prereq) {
	    			edgesSet.add({id:prereq+course.courseID, from:prereq, to:course.courseID})
	    		})
	    	})
	    }
	    addEdgesGraph1 = function(){addEdges($scope.userCourses, $scope.edges)}


		/* CLICKY ON THE HTML PAGE */
		$scope.courseClick = function(course) {
			addAsCompleted(course)
		}
		$scope.myCourseClick = function(course) {
			addAsAvailalbe(course)
		}
		$scope.clickTab100 = function() {currentTab = 1; setGraph2($scope.courses100)}
		$scope.clickTab200 = function() {currentTab = 2; setGraph2($scope.courses200)}
		$scope.clickTab300 = function() {currentTab = 3; setGraph2($scope.courses300)}
		$scope.clickTab400 = function() {currentTab = 4; setGraph2($scope.courses400)}


		refreshUserCourses();
		refreshAvailableCourses();


		/* GRAPH 1 (MY COMPLETED COURSES) */
		$scope.nodes = new vis.DataSet();
    	$scope.edges = new vis.DataSet();
    	$scope.network_data = {	
        	nodes: $scope.nodes,
        	edges: $scope.edges
    	};
    	$scope.network_options = {}

    	/* GRAPH 2 (AVAIALBLE COURSES) */
		$scope.nodes2 = new vis.DataSet();
    	$scope.edges2 = new vis.DataSet();
    	$scope.network_data2 = {	
        	nodes: $scope.nodes2,
        	edges: $scope.edges2
    	};
    	$scope.network_options2 = {}		
}]);