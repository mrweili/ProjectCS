angular.module("projectcs.routes", ["ngRoute", "projectcs.maincontroller", "projectcs.suggestioncontroller", "projectcs.progresscontroller"])
	.config(function($routeProvider) {
		$routeProvider
			.when("/", {
				templateUrl : "/views/mycourses.html",
				controller : "mainController"
			})

			.when("/mycourses", {
				templateUrl : "views/mycourses.html",
				controller : "mainController"
			})

			.when("/suggest",{
				templateUrl : "/views/suggest.html",
				controller : "suggestionController"
			})

			.when("/progress", {
				templateUrl : "/views/progress.html",
				controller : "progressController",
				css : "/stylesheets/progressStyle.css"
			});
	});

