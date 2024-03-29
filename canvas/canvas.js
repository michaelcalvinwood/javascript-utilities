
let startTime;
let img;

let left = 0;

/*
 * slide rectangle in top, right, bottom, left
 * rounded rectangle in the center
 */

//function slideInRectangleLeft (startTime, width, color, animationDuration)
let capturer;
function doCanvas () {
    const canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 1920, 1080);
    const time = new Date();
    const elapsed = time - startTime;
    //console.log(elapsed);

    console.log(time.getSeconds());

    ctx.save();
    ctx.drawImage(img, 0, 0, 1920, 1080);
    ctx.beginPath();
    let rectangleWidth = (elapsed * 2.5)-(canvas.height/2);
    if (rectangleWidth > canvas.width/4) rectangleWidth = canvas.width/4; 
    //console.log(rectangleWidth);
    ctx.rect(0, 0, rectangleWidth, canvas.height);
    //ctx.roundRect(0, 0, rectangleWidth, canvas.height, 20);
    ctx.fillStyle = 'rgba(0, 0, 0, .5)';
    ctx.fill();
    // ctx.fillStyle = 'black';
    // ctx.font = '48px serif';
    // ctx.fillText('Hello world', 10, 50);
      
    ctx.restore();    
    
    if (elapsed <= 5000) {
        CanvasCapture.takePNGSnapshot();
        window.requestAnimationFrame(doCanvas);
    } else {
        
        console.log('saved');
    }
}

let CanvasCapture = window.CanvasCapture.CanvasCapture;

function loadImages () {
    img = new Image();
    img.onload = () => { 
        startTime = Date.now();
        CanvasCapture.init(
            document.getElementById('canvas'),
            { showRecDot: true }, // Options are optional, more info below.
          );
        window.requestAnimationFrame(doCanvas);
        CanvasCapture.beginPNGFramesRecord();
    };
    img.crossOrigin = "Anonymous";
    img.src = 'http://cdn.akc.org/content/article-body-image/funny-basset_hound_yawning.jpg';
}

window.addEventListener('DOMContentLoaded', loadImages);