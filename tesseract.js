
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

var rotationAngles = { zw: 0, yw: 0, xw: 0, xz: 0, xy: 0, yz: 0 };
var rotationSpeeds = {
  zw: 0.01,
  yw: 0.01,
  xw: 0.0,
  xz: 0.01,
  xy: 0.0,
  yz: 0.0
};


var rotate = function(p,r) {
  var rCos = {}, rSin = {};
  var result = {};
  for (var axis in rotationAngles) {
    rCos[axis] = Math.cos(r[axis]);
    rSin[axis] = Math.sin(r[axis]);
  }

  //ZW rotation
  result.x = rCos.zw*p.x - rSin.zw*p.y;
  result.y = rSin.zw*p.x + rCos.zw*p.y;
  result.z = p.z;
  result.w = p.w;

  //YW rotation
  result.x =  rCos.yw*result.x + rSin.yw*result.z;
  result.z = -rSin.yw*result.x + rCos.yw*result.z;

  //XW rotation
  result.y = rCos.xw*result.y - rSin.xw*result.z;
  result.z = rSin.xw*result.y + rCos.xw*result.z;

  //XZ rotation
  result.y =  rCos.xz*result.y + rSin.xz*result.w;
  result.w = -rSin.xz*result.y + rCos.xz*result.w;

  //XY rotation
  result.z = rCos.xy*result.z - rSin.xy*result.w;
  result.w = rSin.xy*result.z + rCos.xy*result.w;

  //YZ rotation
  result.x = rCos.yz*result.x - rSin.yz*result.w;
  result.w = rSin.yz*result.x + rCos.yz*result.w;

  return result;
};

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
context.strokeStyle = "#000000";

var draw = function() {
  var rotatedVertices = vertices.map(function(vertex) {
    return rotate(vertex, rotationAngles);
  });

  var perspective = 0.2;

  //project into three dimensions...
  var finalPositions = rotatedVertices.map(function(vertex) {
    return {
      x: vertex.x,
      y: vertex.y,
      z: vertex.z
      // x: vertex.x * (1-vertex.w*perspective),
      // y: vertex.y * (1-vertex.w*perspective),
      // z: vertex.z * (1-vertex.w*perspective)
    }

  })

  //...and then project down into two.
  var screenPositions = finalPositions.map(function(vertex) {
    return {
      x: vertex.x * 80 + canvas.width/2,
      y: vertex.y * 80 + canvas.height/2,
      // x: vertex.x * (1-vertex.z*perspective) * 80 + canvas.width/2,
      // y: vertex.y * (1-vertex.z*perspective) * 80 + canvas.height/2,
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

  for (var axis in rotationAngles) {
    if (rotationSpeeds[axis])
      rotationAngles[axis] += rotationSpeeds[axis];
  }

  if (running) requestAnimationFrame(draw);
}

var running;
var pause = function() {
  running = false;
}
var start = function() {
  if (running) return;
  running = true;
  requestAnimationFrame(draw);
}

start();
