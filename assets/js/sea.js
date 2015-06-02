// variables
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var SPRING_CONSTANT = 0.005;            // Spring constant for forces applied by adjacent points
var SPRING_CONSTANT_BASELINE = 0.005;   // Sprint constant for force applied to baseline
var Y_OFFSET = Math.round(HEIGHT / 2);                     // Vertical draw offset of simulation
var DAMPING = 0.99;                     // Damping to apply to speed changes
var ITERATIONS = 4;                     // Number of iterations of point-influences-point to do on wave per step

var NUM_BACKGROUND_WAVES = 2;
var BACKGROUND_WAVE_MIN_HEIGHT = 3;
var BACKGROUND_WAVE_MAX_HEIGHT = 9;
var BACKGROUND_WAVE_MIN_COMPRESSION = 1/10; // Amounts by which a particular sine is offset
var BACKGROUND_WAVE_MAX_COMPRESSION = 1/8; // Amounts by which a particular sine is offset
var sineOffsets = [];                   // Amounts by which a particular sine is amplified
var sineAmplitudes = [];                // Amounts by which a particular sine is stretched
var sineStretches = [];                 // Amounts by which a particular sine's offset is multiplied
var offsetStretches = [];               // Set each sine's values to a reasonable random value

var lastUpdate = + new Date;
var offset = 0;                         // A phase difference to apply to each sine
var canvas = null;
var pjs = null;
var wavePoints = null;

function getRandomWithinRange(min, max) {
    return Math.random() * (max - min) + min;
}

for (var i = 0; i < NUM_BACKGROUND_WAVES; i++) {
    var sineOffset = -Math.PI + 2 * Math.PI * Math.random();
    sineOffsets.push(sineOffset);
    var sineAmplitude = getRandomWithinRange(BACKGROUND_WAVE_MIN_HEIGHT, BACKGROUND_WAVE_MAX_HEIGHT);
    sineAmplitudes.push(sineAmplitude);
    var sineStretch = getRandomWithinRange(BACKGROUND_WAVE_MIN_COMPRESSION, BACKGROUND_WAVE_MAX_COMPRESSION);
    sineStretches.push(sineStretch)
    var offsetStretch = getRandomWithinRange(BACKGROUND_WAVE_MIN_COMPRESSION, BACKGROUND_WAVE_MAX_COMPRESSION);
    offsetStretches.push(offsetStretch);
}

function sketchProc(processing)
{  
  processing.setup = function () {
     processing.size(WIDTH, HEIGHT);
     processing.frameRate(30);
  };
  
  processing.draw = function () {
    processing.background(255);
   
    var now = + new Date;
    var delta = now - lastUpdate;
    lastUpdate = now;
    
    updateWave(delta);
    drawWave();
  };
}

function updateWave(dt)
{
    offset = offset + 1;

    for (var i = 0; i < ITERATIONS; i++) {
        
          for (var n = 0; n < wavePoints.length; n++) {
              var p = wavePoints[n];
            
              // force to apply to this point
              var force = 0;

              // forces caused by the point immediately to the left or the right
              var forceFromLeft, forceFromRight;

              if (n == 0) { // wrap to left-to-right
                  var dy = wavePoints[wavePoints.length - 1].y - p.y;
                  forceFromLeft = SPRING_CONSTANT * dy;
              } else { // normally
                  var dy = wavePoints[n - 1].y - p.y;
                  forceFromLeft = SPRING_CONSTANT * dy;
              }
            
              if (n == wavePoints.length - 1) { // wrap to right-to-left
                  var dy = wavePoints[0].y - p.y;
                  forceFromRight = SPRING_CONSTANT * dy;
              } else { // normally
                  var dy = wavePoints[n + 1].y - p.y;
                  forceFromRight = SPRING_CONSTANT * dy;
              }

              // Also apply force toward the baseline
              var dy = Y_OFFSET - p.y;
              forceToBaseline = SPRING_CONSTANT_BASELINE * dy;

              // Sum up forces
              force = force + forceFromLeft;
              force = force + forceFromRight;
              force = force + forceToBaseline;

              // Calculate acceleration
              var acceleration = force / p.mass;

              // Apply acceleration (with damping)
              p.spd.y = DAMPING * p.spd.y + acceleration;

              // Apply speed
              p.y = p.y + p.spd.y;
            
            wavePoints[n] = p;
          }
      }
}

function drawWave()
{
    var context = pjs.externals.context;
    
    var gradientFill = context.createLinearGradient(WIDTH * 0.5, HEIGHT * 0.2,WIDTH * 0.5, HEIGHT);
    gradientFill.addColorStop(0,'#00c0ee');
    gradientFill.addColorStop(1,'rgba(0,170,255,0)');

    context.clearRect(0, 0, WIDTH, HEIGHT);
    context.fillStyle = gradientFill;
    context.beginPath();

    var firstX = wavePoints[0].x;
    var firstY = wavePoints[0].y + overlapSines(wavePoints[0].x);
    var lastX  = wavePoints[wavePoints.length-1].x;
    var lastY  = wavePoints[wavePoints.length-1].y + overlapSines(wavePoints[wavePoints.length-1].x);
    
    moveTo(firstX, firstY);

    var len = wavePoints.length;
    var i;

    var current, previous, next;
		var previousX, previousY, currentX, currentY, x, y;

    for (i = 0; i < len; i++) {
        current = wavePoints[i];
        previous = wavePoints[i-1];
        next = wavePoints[i+1];
        
        if (previous && next) {
            previousX = previous.x;
            previousY = previous.y + overlapSines(previous.x);
            currentX = current.x;
            currentY = current.y + overlapSines(current.x);
        
            x = previousX + (currentX - previousX) / 2;
            y = previousY + (currentY - previousY) / 2;
        
            context.quadraticCurveTo(previousX, previousY, x, y);
        }
    }
    
    context.lineTo(lastX, lastY);
    context.lineTo(WIDTH, HEIGHT);
    context.lineTo(0, HEIGHT);
    context.lineTo(firstX, firstY);

    context.fill();
}

function createPoints()
{
    var numPoints = 7;
    var len = numPoints + 3;
    
    var t = [];
    
    for (var n = 0; n < len; n++) {
        // This represents a point on the wave
        var newPoint = {
            x: n / numPoints * WIDTH,
            y: Y_OFFSET,
            spd: {y:0}, // speed with vertical component zero
            mass: 1
        }
        t.push(newPoint);
    }
    
    return t;
}

function overlapSines(x)
{
    var result = 0;
    
    for (var i = 0;i < NUM_BACKGROUND_WAVES; i++) {
        result = result
            + sineOffsets[i]
            + sineAmplitudes[i] 
            * Math.sin(x * sineStretches[i] + offset * offsetStretches[i]);
    }
    
    return result;
}

function resizeCanvas()
{
    // update sizes
    WIDTH  = window.innerWidth;
    HEIGHT = window.innerHeight;
    
    // regenerate points
    wavePoints = createPoints();
    
    // resize canvas
    pjs.size(window.innerWidth, window.innerHeight);
}

function createWave()
{
    // find closest point
    var closestPoint = null;
    var closestDistance = -1;

    // loop through points
    for (var n = 0; n < wavePoints.length; n++) {
        var p = wavePoints[n];

        // calculate the distance
        var distance = Math.abs(pjs.mouseX - p.x);

        // first
        if (closestDistance == -1) {
            closestPoint = p;
            closestDistance = distance;
            continue;
        }

        // closer
        if (distance <= closestDistance) {
            closestPoint = p;
            closestDistance = distance;
        }
    }

    // update point height
    closestPoint.y = pjs.mouseY;
}

$(function()
{
    // create points
    wavePoints = createPoints();

    // get canvas
    canvas = document.getElementById('sea');
    
    // create processing
    pjs = new Processing(canvas, sketchProc);

    // resize callback
    $(window).resize(resizeCanvas);

    // mouse interaction
    $(document).on("mousedown", createWave);
});