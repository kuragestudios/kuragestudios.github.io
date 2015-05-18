
function Wave()
{
  // Variables
  var WIDTH = window.innerWidth;
  var HEIGHT = window.innerHeight;
  var isActive = true;

  var canvas, context, particles;
  var canvasInterval, waveInterval;

  // Constants
  var DENSITY = .75;
  var FRICTION = 1.14;
  var PARTICULE_COUNT = Math.round(WIDTH / 60) + 1;
  var WAVE_INTERVAL = 2000;
  var WAVE_FORCE = 10;

  this.Initialize = function(canvasId) {
    window.onfocus = function () {
      isActive = true;
    };

    window.onblur = function () {
      isActive = false;
    };

    canvas = document.getElementById(canvasId);

    if (canvas && canvas.getContext) {
      context = canvas.getContext('2d');

      // Generate particles
      particles = [];

      for (var i = 0; i < PARTICULE_COUNT; i++) {
        var particle = {
          x: WIDTH / (PARTICULE_COUNT - 3) * (i - 2), // pad by two particles on each side
          y: HEIGHT * 0.5,
          original: { x: 0, y: HEIGHT * 0.5 } ,
          velocity: { x: 0, y: Math.random() * 3 }, // random for some initial movement in the wave
          force: { x: 0, y: 0 },
          mass: 10
        };
        particles.push(particle);
      }

      // Resize callbacks
      $(window).resize(ResizeCanvas);

      // Setup update functions
      canvasInterval = setInterval( CanvasUpdate, 40 );
      waveInterval = setInterval( InsertWave, WAVE_INTERVAL );

      // Resize canvas
      ResizeCanvas();
    }
  };

  function CanvasUpdate(e)
  {
    if (!isActive) {
      return;
    }

    var gradientFill = context.createLinearGradient(WIDTH * 0.5, HEIGHT * 0.2,WIDTH * 0.5, HEIGHT);
    gradientFill.addColorStop(0,'#00ddee');
    gradientFill.addColorStop(1,'rgba(0,200,250,0)');

    context.clearRect(0, 0, WIDTH, HEIGHT);
    context.fillStyle = gradientFill;
    context.beginPath();
    context.moveTo(particles[0].x, particles[0].y);

    var len = particles.length;
    var i;

    var current, previous, next;

    for (i = 0; i < len; i++) {
      current = particles[i];
      previous = particles[i-1];
      next = particles[i+1];

      if (previous && next) {

        var forceY = 0;

        forceY += -DENSITY * ( previous.y - current.y );
        forceY += DENSITY * ( current.y - next.y );
        forceY += DENSITY/15 * ( current.y - current.original.y );

        current.velocity.y += - ( forceY / current.mass ) + current.force.y;
        current.velocity.y /= FRICTION;
        current.force.y /= FRICTION;
        current.y += current.velocity.y;

        // cx, cy, ax, ay
        context.quadraticCurveTo(previous.x, previous.y, previous.x + (current.x - previous.x) / 2, previous.y + (current.y - previous.y) / 2);
      }

    }

    context.lineTo(particles[particles.length-1].x, particles[particles.length-1].y);
    context.lineTo(WIDTH, HEIGHT);
    context.lineTo(0, HEIGHT);
    context.lineTo(particles[0].x, particles[0].y);

    context.fill();
  }

  function InsertWave()
  {
    if (!isActive) {
      return;
    }

    InsertImpulse( Math.random() * WIDTH, (Math.random() * (WAVE_FORCE * 2) - WAVE_FORCE));
  }

  function InsertImpulse(positionX, forceY)
  {
    var particle = particles[Math.round( positionX / WIDTH * particles.length )];

    if (particle) {
      particle.force.y += forceY;
    }
  }

   function ResizeCanvas(e)
   {
     WIDTH = window.innerWidth;
     HEIGHT = window.innerHeight;

     canvas.width = WIDTH;
     canvas.height = HEIGHT;

     for (var i = 0; i < PARTICULE_COUNT; i++) {
       particles[i].x = WIDTH / (PARTICULE_COUNT - 3) * ( i - 2);
       particles[i].y = HEIGHT*.5;

       particles[i].original.x = particles[i].x;
       particles[i].original.y = particles[i].y;
     }
   }
}

var wave = new Wave();
wave.Initialize('sea');
