angular
	.module("projectcs.progresscontroller", [])
	.controller('progressController', ['$scope', 'CourseService', function($scope, CourseService) {
		var username = 'courseTest';
		var taken = [];
		function getTaken() {
			CourseService.userCourses.query({user : username},function(result){
				console.log(result[0].courseID);
				
				for (i = 0; i < result.length; i ++){
					taken.push(result[i].courseID);
				}

				calculate();
			});


		}
		getTaken();

		var tab = 1;
		$scope.tab = tab;
		$scope.onClickTab = function(num){
			tab = num;
		}

		//--------------------------------------------------------------Major Progress----------------------------------------------
		$scope.firstyear = [{name: '(CSC108H1, ', exclude: ['CSC150H1']}, {name: 'CSC148H1) ', exclude: ['CSC150H1']}, {name: '/ CSC150H1', exclude: ['CSC108H1', 'CSC148H1']},
		{name: 'CSC165H1', exclude:['CSC240H1']}, {name: '(MAT135H1, ', exclude: ['MAT137Y1', 'MAT157Y1']}, {name: 'MAT136H1)', exclude: ['MAT137Y1', 'MAT157Y1']}, 
		{name: '/ MAT137Y1', exclude:['MAT135H1', 'MAT136H1', 'MAT157Y1']}, {name: '/ MAT157Y1', exclude:['MAT135H1', 'MAT136H1', 'MAT137Y1']}];

		$scope.secondyear = [{name: 'CSC207H1', exclude:[]}, {name: '(CSC236H1', exclude:['CSC240H1']}, {name: '/ CSC240H1)', exclude:['CSC165H1', 'CSC236H1']},
		{name: 'CSC258H1', exclude:[]}, {name: '(CSC263H1 / ', exclude:['CSC265H1']}, {name: 'CSC265H1)', exclude:['CSC263H1']}, {name: 'STA247H1 / ', exclude:['STA255H1', 'STA257H1']},
		{name: 'STA255H1 / ', exclude:['STA247H1', 'STA257H1']}, {name: 'STA257H1', exclude:['STA247H1', 'STA255H1']}];

		$scope.lateryear = [{name: 'BCB410H1', exclude:[]}, {name: 'BCB420H1', exclude:[]}, {name: 'BCB430Y1', exclude:[]},
		{name: 'ECE385H1', exclude:[]}, {name: 'ECE489H1', exclude:[]}];

		$scope.laterCSC = {name: 'Any 200-/300-/400-level CSC course', exclude:[]};
		$scope.lateryearMAT = [ {name: '(MAT221H1 / ', exclude:['MAT223H1', 'MAT240H1']}, {name: 'MAT223H1 / ', exclude:['MAT221H1', 'MAT240H1']}, 
		{name: 'MAT240H1)', exclude:['MAT221H1', 'MAT223H1']}, {name: '(MAT235H1/ ', exclude:['MAT237H1', 'MAT257H1']}, {name: 'MAT237H1 / ', exclude:['MAT235H1', 'MAT257H1']}, 
		{name: 'MAT257H1)', exclude:['MAT235H1', 'MAT237H1']}];
		$scope.laterMAT = {name: 'Any 300-/400-level MAT course except MAT329Y1, MAT390H1, MAT391H1', exclude:[]};

		//--------------------------------------------------------------Focus Progress------------------------------------------------
		$scope.secondyearFocus = [{name: 'CSC209H1', exclude:[]}, {name: 'MAT221H1 /', exclude:['MAT223H1', 'MAT240H1']}, {name: 'MAT223H1 /', exclude:['MAT221H1', 'MAT240H1']},
		 {name: 'MAT240H1', exclude:['MAT221H1', 'MAT223H1']}];

		$scope.lateryearFocus = [{name: 'CSC369H1', exclude:[]}, {name:'CSC373H1', exclude:[]}, {name:'CSC324H1', exclude:[]}, {name:'CSC343H1', exclude:[]},
		{name:'CSC443H1', exclude:[]}, {name:'CSC469H1', exclude:[]}, {name:'CSC488H1', exclude:[]}];

		$scope.lateryearFocus2 = [{name: '(CSC372H1 /', exclude:['ECE385H1']}, {name: 'ECE385H1)', exclude:['CSC372H1']}, {name: 'CSC358H1', exclude:[]}, 
		{name: 'CSC458H1', exclude:[]}];
		var laterCSCourses = [];
		var laterMATCourses = [];

		$scope.laterCSCourses = laterCSCourses;



		var musttakeCSC= ['CSC108H1', 'CSC148H1', 'CSC150H1', 'CSC165H1', 'CSC207H1', 'CSC236H1', 'CSC240H1', 'CSC258H1', 'CSC263H1', 'CSC265H1'];
		var excluded = [];
		
		$scope.set_color = function (course) {
			for (t = 0; t < taken.length; t++){
				var name = course['name'].replace("(", "").replace(")", "").replace(",", "").replace("/", "").trim();
				if (name == taken[t]){
					for (a = 0; a < course.exclude.length; a++){
						excluded.push(course.exclude[a]);
					}
					return { color: "green" }
				}
			}

			for (b = 0; b < excluded.length; b++){
				if (name == excluded[b]){
					return {color: "grey", 'text-decoration': 'line-through'}	
				}
			}

			return {color: "red"}
		}

		$scope.set_laterCS_color = function () {
			return {color: "green"}
		}
//-------------------------------------------------------Major Progress----------------------------------------------
		var totalcredit = 0;
		var totalmajor = 0;
		function calculate(){
			for (i = 0; i < taken.length ; i++){
				var course = taken[i];
				var first4code = course.substring(0, 4);
				var code = taken[i][6];
				if (first4code == "CSC2" || first4code == "CSC3" || first4code == "CSC4"){
					var check = true;
					for (t = 0; t < musttakeCSC.length ; t++){
						if (musttakeCSC[t] == course){
							check = false;
						}
					}
					if (check == true){
						var picked = {name: course};
						laterCSCourses.push(picked);

						if (code == "H"){
							totalmajor = totalmajor + 0.5;
						}
						else{
							totalmajor++;
						}
					}
				}

				for (x = 0; x < musttakeCSC.length; x++){
					if (course == musttakeCSC[x]){
						totalmajor = totalmajor + 0.5;
					}
				}
				//count credits
				if (code == "H"){
					totalcredit = totalcredit + 0.5;
				}
				else {
					totalcredit++;
				}
				presentOverall();
			}
		}
		
		
		

		//----------------------------------------------Overall Progress----------------------------------------------
		function presentOverall(){
			if (totalcredit >= 20){
				var statusTotal = "Complete";
				$scope.creditStyle={"color":"green"};
			}
			else{
				var statusTotal = "Incomplete";
				$scope.creditStyle={"color":"red"};
			}

			if (totalmajor >= 8){
				var statusMajor = "Complete";
				$scope.majorStyle={"color":"green"};
			}
			else{
				var statusMajor = "Incomplete";
				$scope.majorStyle={"color":"red"};
			}

			$scope.statusTotal = statusTotal;
			$scope.obtainTotal = totalcredit;

			if (totalcredit <= 20){
				$scope.leftTotal = 20 - totalcredit;
			}
			else{
				$scope.leftTotal = 0;
			}
			

			$scope.statusMajor = statusMajor;
			$scope.obtainMajor = totalmajor;
			if (totalmajor <= 8){
				$scope.leftMajor = 8 - totalmajor;
			}
			else{
				$scope.leftMajor = 0;
			}	

		}
	}]);
