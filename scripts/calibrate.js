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
    addClass(btn, "btn-primary");
    removeClass(btn, "btn-default");

    calibrateMode = true;
    lastCalibratingPoint = currentToolTipPosition;
    currentCalibratingPoint = "topLeft";
    highlightCalibratingPoint(currentCalibratingPoint);
  }
}

function afterCalibrate() {
  if (calibrateMode) {
    var btn = document.getElementById("btn-calibrate");
    addClass(btn, "btn-default");
    removeClass(btn, "btn-primary");

    calibrateMode = false;
    lastCalibratingPoint = null;
    currentCalibratingPoint = null;
    highlightCalibratingPoint(null);

    console.table(surface);
  }
}

function waitingForResult(callback) {
  setTimeout(function() {
    if (accumulatedDuration >= 1500) {
      callback(currentToolTipPosition);
    } else {
      if (currentToolIsAroundTheSameSpot()) {
        accumulatedDuration += 100;
      } else {
        accumulatedDuration = 0;
        lastCalibratingPoint = currentToolTipPosition;
      }
      if (calibrateMode) {
        waitingForResult(callback);
      }
    }
  }, 100);
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
