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

function vectorToString(vector, digits) {
  if (typeof digits === "undefined") {
    digits = 1;
  }
  return "(" + vector[0].toFixed(digits) + ", "
             + vector[1].toFixed(digits) + ", "
             + vector[2].toFixed(digits) + ")";
}

Leap.loop({enableGestures: enableGestures}, function(frame) {
  var pointableOutput = document.getElementById("pointableData");
  if (frame.pointables.length == 1) {
    var pointable = frame.pointables[0];
    if (pointable.tool) {
      // pointable.tipVelocity

      toolDetected = true;
      currentToolTipPosition = pointable.tipPosition;
      pointableString += "<div>" + toolDetected + ",  " + vectorToString(currentToolTipPosition) + "</div>";
    }
  }
  else {
    toolDetected = false;
    currentToolTipPosition = null;
    pointableString += "<div>Nothing</div>";
  }
  pointableOutput.innerHTML = pointableString;

  // Store frame for motion functions
  previousFrame = frame;
})
