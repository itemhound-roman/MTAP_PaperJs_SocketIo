var socket = io.connect();

tool.minDistance = 5;
tool.maxDistance = 15;

var external_paths = {};
var start = {};
var path = {};

function onMouseDown(event){
  path = new Path();
  path.fillColor = 'black';
  path.add(event.point);
  start.start = event.point;
}

function onMouseDrag(event){
  var uid = socket.socket.sessionid;
  var step = event.delta / 2;
  step.angle += 15;

  var top = event.middlePoint + step;
  var bottom = event.middlePoint - step;

  path.add(top);
  path.insert(0, bottom);
  path.smooth();

  var dataToEmit = {top: top, bottom: bottom};
  socket.emit('draw:progress', uid, start, dataToEmit);
}

function onMouseUp(event){
  path.add(event.point);
  path.closed = true;
  path.smooth();
  var end = event.point;
  var uid = socket.socket.sessionid;

  var dataToEmit = {end:end};
  socket.emit('draw:end', uid, dataToEmit);  
}

socket.on('draw:progress', function(artist, start, coordindates){
  var uid = socket.socket.sessionid;

  if(uid != artist){   
    var thispath = external_paths[artist];
    if( !thispath ){
      external_paths[artist] = new Path();
      thispath = external_paths[artist];
      thispath.fillColor = 'black';

      var thisstart = new Point(start.start[1], start.start[2]);
      thispath.add(thisstart);
    }
    else{
      var thistop = new Point(coordindates.top[1], coordindates.top[2]);
      var thisbottom = new Point(coordindates.bottom[1], coordindates.bottom[2]);
      thispath.add(thistop);
      thispath.insert(0, thisbottom);
      thispath.smooth();
    }
  }
})

socket.on('draw:end', function(artist, data){

  var uid = socket.socket.sessionid;
  if(uid != artist){
    var thispath = external_paths[artist];
    if( thispath ){
      var thisend = new Point(data.end[1], data.end[2]);
      thispath.add(thisend);
      thispath.closed = true;
      thispath.smooth();
      view.draw();
      external_paths[artist] = false;
    }
  }
});



