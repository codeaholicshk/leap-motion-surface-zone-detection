var accumulatedDuration = 0;
var lastCalibratingPoint = null;
var calibrateMode = false;
var surface = {
  topLeft: [0, 0],
  topRight: [0, 0],
  bottomRight: [0, 0],
  bottomLeft: [0, 0]
};
var currentCalibratingPoint = null; // "topLeft", "topRight", "bottomRight", "bottomLeft"
function whenResultFound() {
  surface[currentCalibratingPoint] = [currentToolTipPosition[0], currentToolTipPosition[1]];
  accumulatedDuration = 0;
  calibrateNextPoint();
}

function calibrate() {
  beforeCalibrate();

  waitingForResult(whenResultFound);
}

function beforeCalibrate() {
  if (!calibrateMode) {
    document.getElementById("message").innerHTML = "On your table surface, point your tool to top left hand corner.";

    var btn = document.getElementById("btn-calibrate");
    addClass(btn, "btn-danger");
    removeClass(btn, "btn-primary");
    btn.innerHTML = "Calibrating ...";

    calibrateMode = true;
    lastCalibratingPoint = currentToolTipPosition;
    currentCalibratingPoint = "topLeft";
    highlightCalibratingPoint(currentCalibratingPoint);
  }
}

function afterCalibrate() {
  if (calibrateMode) {
    var btn = document.getElementById("btn-calibrate");
    addClass(btn, "btn-primary");
    removeClass(btn, "btn-danger");
    btn.innerHTML = "Start Calibrate";

    calibrateMode = false;
    lastCalibratingPoint = null;
    currentCalibratingPoint = null;
    highlightCalibratingPoint(null);

    document.getElementById("surface-size").innerHTML = "<table class='table'>" +
      "<tr><td>" + surface.topLeft[0] + "</td><td>" + surface.topLeft[1] + "</td></tr>" +
      "<tr><td>" + surface.topRight[0] + "</td><td>" + surface.topRight[1] + "</td></tr>" +
      "<tr><td>" + surface.bottomRight[0] + "</td><td>" + surface.bottomRight[1] + "</td></tr>" +
      "<tr><td>" + surface.bottomLeft[0] + "</td><td>" + surface.bottomLeft[1] + "</td></tr>" +
      "</table>";
  }
}

function waitingForResult(callback) {
  setTimeout(function() {
    if (accumulatedDuration >= 100) {
      callback(currentToolTipPosition);
    } else {
      if (currentToolIsAroundTheSameSpot()) {
        accumulatedDuration += 1;
        var progress = accumulatedDuration + '%';
        document.getElementById("message-progress").innerHTML = '<div class="progress-bar progress-bar-info" role="progressbar" style="width: ' + progress + '">' +
          progress +
        '</div>';
      } else {
        accumulatedDuration = 0;
        lastCalibratingPoint = currentToolTipPosition;

        document.getElementById("message-progress").innerHTML = '<div class="progress-bar progress-bar-danger" role="progressbar" style="width: 100%">' +
        '  Move your stick to the detection zone' +
        '</div>';
      }
      if (calibrateMode) {
        waitingForResult(callback);
      }
    }
  }, 10);
}

function currentToolIsAroundTheSameSpot() {
  if (lastCalibratingPoint != null && currentToolTipPosition != null) {
    return aroundSameSpot(lastCalibratingPoint[0], currentToolTipPosition[0])
      && aroundSameSpot(lastCalibratingPoint[1], currentToolTipPosition[1])
      && aroundSameSpot(lastCalibratingPoint[2], currentToolTipPosition[2]);
  } else {
    return false;
  }
}

function aroundSameSpot(firstValue, secondValue) {
  return Math.abs(firstValue.toFixed(1) - secondValue.toFixed(1)) < 5;
}

function calibrateNextPoint() {
  switch(currentCalibratingPoint) {
    case "topLeft":
      currentCalibratingPoint = "topRight";
      highlightCalibratingPoint(currentCalibratingPoint);
      calibrate();
      break;
    case "topRight":
      currentCalibratingPoint = "bottomRight";
      highlightCalibratingPoint(currentCalibratingPoint);
      calibrate();
      break;
    case "bottomRight":
      currentCalibratingPoint = "bottomLeft";
      highlightCalibratingPoint(currentCalibratingPoint);
      calibrate();
      break;
    case "bottomLeft":
      currentCalibratingPoint = null;
      afterCalibrate();
    default:
      currentCalibratingPoint = null;
  }
}

window.onload = function() {
  document.getElementById("btn-calibrate").onclick = calibrate;
};
