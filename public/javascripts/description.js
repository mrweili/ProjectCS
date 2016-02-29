$(document).ready(function() { 
    $("#csc108").click(function() {
    	var text = "<h4>CSC108H1    Introduction to Computer Programming[36L]</h4>" +
    	"Programming in a language such as Python. Elementary data types, lists, maps."+
    	"Program structure: control flow, functions, classes, objects, methods."+
    	" Algorithms and problem solving. Searching, sorting, and complexity. Unit testing. "+
    	"No prior programming experience required.\n<br>"+
    	"Exclusion: CSC120H1, CSC148H1<br>"+
    	"Breadth Requirement: The Physical and Mathematical Universes (5)";
      $("#description").empty();
       $("#description").append(text);
    });
    $("#csc120").click(function() {
    	var text = "<h4>CSC120H1    Computer Science for the Sciences[24L/12P]</h4>" +
    	"An introduction to computer science for students in other sciences, with an emphasis on gaining practical skills."+
    	"Introduction to programming with examples and exercises appropriate to the sciences; "+
    	" web programming; software tools.  Topics from: database design, considerations in numerical calculation, using UNIX/LINUX systems. At the end of this "+
    	"course you will be able to develop computer tools for scientific applications, such as the structuring and "+
    	" analysis of experimental data. With some additional preparation, you will also be ready to go on to CSC148H1.  "+
    	" Practical (P) sections consist of supervised work in the computer laboratory. No programming experience is necessary.\n<br>" +
    	"Exclusion: Any CSC course, with the exception of CSC104H1<br>"+
    	"Breadth Requirement: The Physical and Mathematical Universes (5)";
      $("#description").empty();
       $("#description").append(text);
    });
    $("#csc148").click(function() {
    	var text = "<h4>CSC148H1    Introduction to Computer Science[36L/24P]</h4>" +
    	"Abstract data types and data structures for implementing them. Linked data structures. "+
    	"Encapsulation and information-hiding. Object-oriented programming. Specifications. "+
    	"Analyzing the efficiency of programs. Recursion. This course assumes programming experience "+
    	"as provided by CSC108H1. Students who already have this background may consult the Computer "+
    	"Science Undergraduate Office for advice about skipping CSC108H1. Practical (P) sections "+
    	"consist of supervised work in the computing laboratory. These sections are offered when "+
    	"facilities are available, and attendance is required. NOTE: Students may go to their college "+
    	"to drop down from CSC148H1 to CSC108H1. See above for the drop down deadline.\n<br>"+
    	"Prerequisite: CSC108H1/(equivalent programming experience)<br>"+
		"Exclusion: CSC150H1; you may not take this course after taking more than two CSC courses at the 200-level or higher<br>"+
    	"Breadth Requirement: The Physical and Mathematical Universes (5)";
      $("#description").empty();
       $("#description").append(text);
    });
    $("#csc165").click(function() {
    	var text = "<h4>CSC165H1    Mathematical Expression and Reasoning for Computer Science[36L/24T]</h4>" +
    	"Introduction to abstraction and rigour. Informal introduction to logical notation and reasoning. "+
    	"Understanding, using and developing precise expressions of mathematical ideas, including definitions"+
    	" and theorems. Structuring proofs to improve presentation and comprehension. General problem-solving "+
    	"techniques. Running time analysis of iterative programs.  Formal definition of Big-Oh.  "+
    	"Diagonalization, the Halting Problem, and some reductions. Unified approaches to programming and "+
    	"theoretical problems.\n<br>"
    	
		"Prerequisite: CSC108H1/CSC120H1 OR satisfy corequisite<br>"+
		"Corequisite: (CSC108H1/CSC120H, MAT137Y1/MAT157Y1)/ CSC148H1<br>"+
		"Exclusion: CSC236H1, CSC240H1<br>"+
    	"Breadth Requirement: The Physical and Mathematical Universes (5)";
      $("#description").empty();
       $("#description").append(text);
    });
});

function display(jsonData,errorMessage){
    if (jsonData.length == 0){
        $("#div1").empty();
        $("#div1").append("<h2>"+errorMessage+"<h2>"); 
    }
    else{
        var info = (JSON.stringify(jsonData, null, 4));
        $("#div1").empty();
        for (var i in jsonData) {
            $("#div1").append("<pre>" + JSON.stringify(jsonData[i], null, 4) + "</pre>");
        }
    }

}