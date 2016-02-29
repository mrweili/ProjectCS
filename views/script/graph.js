// add some nodes to the graph and watch it go...
givenData = [{name:'csc108',data:{preReqs:[], exclusions:[], clicked: false}},
            {name:'csc165',data:{preReqs:[], exclusions:[], clicked: false}},
            {name:'csc148',data:{preReqs:['csc108','csc165'], exclusions:[], clicked: false}},
            {name:'csc207',data:{preReqs:['csc148'], exclusions:[], clicked: false}},
            {name:'csc209',data:{preReqs:['csc209'], exclusions:[], clicked: false}},
            {name:'csc236',data:{preReqs:['csc148','csc165'], exclusions:[], clicked: false}},
            {name:'csc258',data:{preReqs:['csc148','csc165'], exclusions:[], clicked: false}},
            {name:'csc263',data:{preReqs:['csc207','csc236'], exclusions:[], clicked: false}}

            ];

/*  another way to add
  sys.graft({
    nodes:{#name:{data}},
    edges:{#name{ #name2:{data}}
  })
*/
function parseCourseList(listItem){
  return listItem.split("/");
}

function extract(data) {
  result = [];

  // data.forEach(function(course){
  //   result.append({
  //     name: course.courseID,
  //     data: {preReqs: course.prereqs,
  //           exclusions:
  //           clicked: false
  //           }
  //   });
  // });
}



/* Page is ready */
$(document).ready(function(){
  var sys = arbor.ParticleSystem(0, 600, 1); //repulsion/stiffness/friction 100,600,0.5
  sys.parameters({gravity:true}); // gravity toward center
  sys.renderer = Renderer("#viewport"); // our canvas

  /* add the inital nodes */
  reUpdateAdd(sys);
});

/* The Renderer for Arbor.js */
var Renderer = function(canvas){
  var canvas = $(canvas).get(0);
  var ctx = canvas.getContext("2d");
  var particleSystem;

  var that = {
    init:function(system){
      // the particle system will call the init function once, right before the
      // first frame is to be drawn. it's a good place to set up the canvas and
      // to pass the canvas size to the particle system
      //
      // save a reference to the particle system for use in the .redraw() loop
      particleSystem = system;
      // inform the system of the screen dimensions so it can map coords for us.
      // if the canvas is ever resized, screenSize should be called again with
      // the new dimensions
      particleSystem.screenSize(canvas.width, canvas.height) 
      particleSystem.screenPadding(80) // leave an extra 80px of whitespace per side
      
      // set up some event handlers to allow for node-dragging
      that.initMouseHandling()
    },

    redraw:function(){
      // redraw will be called repeatedly during the run whenever the node positions
      // change. the new positions for the nodes can be accessed by looking at the
      // .p attribute of a given node. however the p.x & p.y values are in the coordinates
      // of the particle system rather than the screen. you can either map them to
      // the screen yourself, or use the convenience iterators .eachNode (and .eachEdge)
      // which allow you to step through the actual node objects but also pass an
      // x,y point in the screen's coordinate system
      // 
      ctx.fillStyle = "white"
      ctx.fillRect(0,0, canvas.width, canvas.height)
      
      /* DRAW THE EDGES */
      particleSystem.eachEdge(function(edge, pt1, pt2){
        // edge: {source:Node, target:Node, length:#, data:{}}
        // pt1:  {x:#, y:#}  source position in screen coords
        // pt2:  {x:#, y:#}  target position in screen coords

        // draw a line from pt1 to pt2
        ctx.save();
        if (edge.source.data.clicked == false) ctx.globalAlpha = 0.5;
        ctx.strokeStyle = "rgba(0,0,0, .333)"
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(pt1.x, pt1.y)
        ctx.lineTo(pt2.x, pt2.y)
        ctx.stroke()
        ctx.restore();
      })

      /* DRAW THE NODES */
      particleSystem.eachNode(function(node, pt){
        // node: {mass:#, p:{x,y}, name:"", data:{}}
        // pt:   {x:#, y:#}  node position in screen coords

        // draw a rectangle centered at pt
        var w = 10
        ctx.save();
        if (node.data.clicked == false) {
          ctx.globalAlpha = 0.1;
        }
        ctx.fillStyle = (node.data.alone) ? "orange" : "black"
        ctx.fillRect(pt.x-w/2, pt.y-w/2, w,w);
        ctx.restore();

        //node text
        ctx.fillStyle = "black";
        ctx.font = 'italic 13px sans-serif';
        ctx.fillText (node.name, pt.x+8, pt.y+8);
      })          
    },

    initMouseHandling:function() {
      // set up a handler object that will initially listen for clicks then
      var handler = {
        clicked:function(e){
          var pos = $(canvas).offset();
          _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top); //mouse pos on cavas
          clicked = particleSystem.nearest(_mouseP); // the clicked node

          // toggle the clicked node
          clicked.node.data.clicked = ! clicked.node.data.clicked;

          reUpdateDel(particleSystem);
          reUpdateAdd(particleSystem);

          return;
        }
      }

      // start listening for clicks
      $(canvas).mousedown(handler.clicked);
    }
      
  }
  return that;
};

/* determine if a course is satisfied in the system */
function satisfied(course, system){
  var result = true;

  // go through course pre requirments
  course.data.preReqs.forEach(function(preReq){
    var preReqNode = system.getNode(preReq);
    // not in the system or not active yet
    if (preReqNode == undefined || preReqNode.data.clicked == false) {
      result = false;
    }
  });

/*  // go through course pre requirments
  course.data.preReqs.forEach(function(preReq){
    //preReq is just a name

    var preReqItemList = preReq.split("/");

    // go through "csc2/csc1"
    preReqItemList.forEach(function(preReqItem) {
      var exist = [];
      var preReqNode = system.getNode(preReqItem);
      // not in the system or not active yet
      if (preReqNode == undefined || preReqNode.data.clicked == false) {
        exist.append(false);
      } 
      else {
        exist.append(true);
      }
    });
    if (!(true in exist)) {
      result = false;
    }
  });*/

  // go through the course exclusions
  course.data.exclusions.forEach(function(exclusion){
    var exclusionNode = system.getNode(exclusion);
    // its in the system!
    if (exclusionNode != undefined && exclusionNode.clicked == true) {
      result = false;
    }
  });

  return result;
}

/* reupdate and add new nodes in the system
  they will be initially greyed out when added
*/
function reUpdateAdd(system) {
  // go through the data for each course
  givenData.forEach(function(course){
      // is that course now satisfied?
      if (satisfied(course,system)){
        // add that onto canvas
        system.addNode(course.name,course.data);
        
        //also all the edges
        course.data.preReqs.forEach(function(req){
          system.addEdge(course.name, req);
        });
      }
  });
}

/* reupdate and remove nodes in the system */
function reUpdateDel(system) {
  // var goneNode;
  // reupdate all the nodes in the System
  system.eachNode(function(node,pt){
    if (satisfied(node, system) == false){
      system.pruneNode(node.name);
      goneNode = node.name;
    };
  });

  // system.eachEdge(function(edge, pt1, pt2){
  //   if (edge.source.name == goneNode) {
  //     system.pruneEdgue
  //   }
  // });
}
