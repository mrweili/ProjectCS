var app = angular.module('projectcs.maincontroller');


app.factory('CourseService',
  ['$resource', function ($resource) {
    return ({
      getUser:          $resource('/api/users/:user', {user: '@user'}),
      userCourses:      $resource('/api/users/:user/courses', {user: '@user'}),
      deleteCourse:     $resource('/api/users/:user/courses/:course', {user: '@user', course: '@course'}),
      availCourses:     $resource('/api/user/:user/availableCourses'),
      availCoursesLevel:$resource('/api/users/:user/availableCourses/:level', {user: '@user', level: '@level'}),
      getCourse:        $resource('/api/courses/:cid', {cid: '@cid'})
  })
}])




app.directive('visNetwork', function() {
    return {
        restrict: 'E',
        require: '^ngModel',
        scope: {
            ngModel: '=',
            onSelect: '&',
            options: '='
        },
        link: function($scope, $element, $attrs, ngModel) {
            var network = new vis.Network($element[0], $scope.ngModel, $scope.options || {});

            var onSelect = $scope.onSelect() || function(prop) {};
            network.on('select', function(properties) {
                onSelect(properties);
            });

        }

    }
});
