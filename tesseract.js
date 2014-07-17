
var vertices = [
  {x: 1, y: 1, z: 1, w: 1},
  {x: 1, y: 1, z: 1, w:-1},
  {x: 1, y: 1, z:-1, w: 1},
  {x: 1, y: 1, z:-1, w:-1},
  {x: 1, y:-1, z: 1, w: 1},
  {x: 1, y:-1, z: 1, w:-1},
  {x: 1, y:-1, z:-1, w: 1},
  {x: 1, y:-1, z:-1, w:-1},
  {x:-1, y: 1, z: 1, w: 1},
  {x:-1, y: 1, z: 1, w:-1},
  {x:-1, y: 1, z:-1, w: 1},
  {x:-1, y: 1, z:-1, w:-1},
  {x:-1, y:-1, z: 1, w: 1},
  {x:-1, y:-1, z: 1, w:-1},
  {x:-1, y:-1, z:-1, w: 1},
  {x:-1, y:-1, z:-1, w:-1}
];

var edges = [
  {start: 0, end: 1},
  {start: 0, end: 2},
  {start: 0, end: 4},
  {start: 0, end: 8},
  {start: 1, end: 3},
  {start: 1, end: 5},
  {start: 1, end: 9},
  {start: 2, end: 3},
  {start: 2, end: 6},
  {start: 2, end:10},
  {start: 3, end: 7},
  {start: 3, end:11},
  {start: 4, end: 5},
  {start: 4, end: 6},
  {start: 4, end:12},
  {start: 5, end: 7},
  {start: 5, end:13},
  {start: 6, end: 7},
  {start: 6, end:14},
  {start: 7, end:15},
  {start: 8, end: 9},
  {start: 8, end:10},
  {start: 8, end:12},
  {start: 9, end:11},
  {start: 9, end:13},
  {start:10, end:11},
  {start:10, end:14},
  {start:11, end:15},
  {start:12, end:13},
  {start:12, end:14},
  {start:13, end:15},
  {start:14, end:15}
];

var rotationAngles = { zw: 0.01, yw: 0.0, xw: 0.01, xz: 0.0, xy: 0.0, yz: 0.01 };


var rotate = function(p,r) {
  var rCos = {}, rSin = {};
  var temp = {};
  for (var axis in rotationAngles) {
    rCos[axis] = Math.cos(r[axis]);
    rSin[axis] = Math.sin(r[axis]);
  }

  //ZW rotation
  temp.x = ( rCos.zw*p.x) + (-rSin.zw*p.y);
  temp.y = ( rSin.zw*p.x) + ( rCos.zw*p.y);
  p.x = temp.x;
  p.y = temp.y;

  //YW rotation
  temp.x = ( rCos.yw*p.x) + ( rSin.yw*p.z);
  temp.z = (-rSin.yw*p.x) + ( rCos.yw*p.z);
  p.x = temp.x;
  p.z = temp.z;

  //XW rotation
  temp.y = ( rCos.xw*p.y) + (-rSin.xw*p.z);
  temp.z = ( rSin.xw*p.y) + ( rCos.xw*p.z);
  p.y = temp.y;
  p.z = temp.z;

  //XZ rotation
  temp.y = ( rCos.xz*p.y) + ( rSin.xz*p.w);
  temp.w = (-rSin.xz*p.y) + ( rCos.xz*p.w);
  p.y = temp.y;
  p.w = temp.w;

  //XY rotation
  temp.z = ( rCos.xy*p.z) + (-rSin.xy*p.w);
  temp.w = ( rSin.xy*p.z) + ( rCos.xy*p.w);
  p.z = temp.z;
  p.w = temp.w;

  //YZ rotation
  temp.x = ( rCos.yz*p.x) + (-rSin.yz*p.w);
  temp.w = ( rSin.yz*p.x) + ( rCos.yz*p.w);
  p.x = temp.x;
  p.w = temp.w;

  return p;
};

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
context.strokeStyle = "#000000";

var draw = function() {
  var rotatedVertices = vertices.map(function(vertex) {
    return rotate(vertex, rotationAngles);
  });

  var perspective = {
    z: 0.3,
    w: 0.25
  };
  var screenPositions = rotatedVertices.map(function(vertex) {
    return {
      x: vertex.x * (1-vertex.w*perspective.w) * (1-vertex.z*perspective.z) * 80 + canvas.width/2,
      y: vertex.y * (1-vertex.w*perspective.w) * (1-vertex.z*perspective.z) * 80 + canvas.height/2,
    };
  });

  canvas.width = canvas.width;

  edges.forEach(function(edge) {
    var start = screenPositions[edge.start];
    var end = screenPositions[edge.end];
    context.moveTo(start.x,start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
  });

  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
