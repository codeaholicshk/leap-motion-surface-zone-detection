// Store frame for motion functions
var previousFrame = null;
var enableGestures = false;
var resultFound = false;
var toolDetected = false;
var pointableString = "";

var currentToolTipPosition = {
  x: null,
  y: null,
  z: null
}

Leap.loop({enableGestures: enableGestures}, function(frame) {
  if (frame.pointables.length == 1) {
    var pointable = frame.pointables[0];
    if (pointable.tool) {
      toolDetected = true;
      currentToolTipPosition = pointable.tipPosition;
    }
  }
  else {
    toolDetected = false;
    currentToolTipPosition = null;
  }
  previousFrame = frame;
})
