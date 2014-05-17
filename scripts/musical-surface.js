
function drawSurface() {
  var c = document.getElementById("musical-surface");
  var ctx = c.getContext("2d");
  ctx.beginPath();
  ctx.fillStyle = 'white';
  ctx.lineWidth="1";
  ctx.strokeStyle="gray";
  ctx.rect(10,10,780,380);
  ctx.stroke();
}

function highlightCalibratingPoint(position) {
  var c = document.getElementById("musical-surface");
  var ctx = c.getContext("2d");

  var x = 0;
  var y = 0;

  switch(currentCalibratingPoint) {
    case "topLeft":
      x = 10;
      y = 10;
      break;
    case "topRight":
      x = 790;
      y = 10;
      break;
    case "bottomRight":
      x = 790;
      y = 390;
      break;
    case "bottomLeft":
      x = 10;
      y = 390;
      break;
    default:
      break;
  }


  if (position === null) {
    ctx.clearRect(0, 0, 800, 400);
    drawSurface();
  } else {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(x, y, 10, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.restore();
  }
}

drawSurface();
