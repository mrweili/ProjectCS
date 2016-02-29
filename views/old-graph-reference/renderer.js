(function(){

  Renderer = function(canvas){
    var canvas = $(canvas).get(0)
    var ctx = canvas.getContext("2d");
    var gfx = arbor.Graphics(canvas)
    var particleSystem = null

    var that = {
      init:function(system){
        particleSystem = system
        particleSystem.screenSize(canvas.width, canvas.height) 
        particleSystem.screenPadding(80)
      },

      redraw:function(){
       ctx.fillStyle = "white";
       ctx.fillRect (0,0, canvas.width, canvas.height);

        particleSystem.eachNode(function (node, pt) {
                    //var node = particleSystem.getNode("Carrol Wahi")
                    if (node.data.color == "red") {
                        var pos = $(canvas).offset();
                        var point = particleSystem.fromScreen(arbor.Point(pos.left, pos.top));
                        node._fixed = true;
                        node._p = point;
                        //console.log("x=" + point.x + ", y=" + point.y);
                        node.tempMass = .1
                    }
                });

       particleSystem.eachEdge (function (edge, pt1, pt2)
       {
        ctx.strokeStyle = "rgba(0,0,0, .333)";
        ctx.lineWidth = 1;
        ctx.beginPath ();
        ctx.moveTo (pt1.x, pt1.y);
        ctx.lineTo (pt2.x, pt2.y);
        ctx.stroke ();

        ctx.fillStyle = "black";
        ctx.font = 'italic 13px sans-serif';
        ctx.fillText (edge.data.name, (pt1.x + pt2.x) / 2, (pt1.y + pt2.y) / 2);

      });

       particleSystem.eachNode (function (node, pt)
       {
        var w = 10;
        ctx.fillStyle = "orange";
        ctx.fillRect (pt.x-w/2, pt.y-w/2, w,w);
        ctx.fillStyle = "black";
        ctx.font = 'italic 13px sans-serif';
        ctx.fillText (node.name, pt.x+8, pt.y+8);
      }); 
     }
   }

    // helpers for figuring out where to draw arrows (thanks springy.js)
    var intersect_line_line = function(p1, p2, p3, p4)
    {
      var denom = ((p4.y - p3.y)*(p2.x - p1.x) - (p4.x - p3.x)*(p2.y - p1.y));
      if (denom === 0) return false // lines are parallel
        var ua = ((p4.x - p3.x)*(p1.y - p3.y) - (p4.y - p3.y)*(p1.x - p3.x)) / denom;
      var ub = ((p2.x - p1.x)*(p1.y - p3.y) - (p2.y - p1.y)*(p1.x - p3.x)) / denom;

      if (ua < 0 || ua > 1 || ub < 0 || ub > 1)  return false
        return arbor.Point(p1.x + ua * (p2.x - p1.x), p1.y + ua * (p2.y - p1.y));
    }

    var intersect_line_box = function(p1, p2, boxTuple)
    {
      var p3 = {x:boxTuple[0], y:boxTuple[1]},
      w = boxTuple[2],
      h = boxTuple[3]

      var tl = {x: p3.x, y: p3.y};
      var tr = {x: p3.x + w, y: p3.y};
      var bl = {x: p3.x, y: p3.y + h};
      var br = {x: p3.x + w, y: p3.y + h};

      return intersect_line_line(p1, p2, tl, tr) ||
      intersect_line_line(p1, p2, tr, br) ||
      intersect_line_line(p1, p2, br, bl) ||
      intersect_line_line(p1, p2, bl, tl) ||
      false
    }

    return that
  }    
  
})()