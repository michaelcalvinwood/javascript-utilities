
// Image + Overlay + Text

function doCanvas () {
    const canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');

    let img = new Image();
    img.onload = () => {
        ctx.drawImage(img, 0, 0, 1920, 1080);
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width/3, canvas.height);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.font = '48px serif';
        ctx.fillText('Hello world', 10, 50);
      };
    
    img.src = 'http://cdn.akc.org/content/article-body-image/funny-basset_hound_yawning.jpg';

}

window.addEventListener('DOMContentLoaded', doCanvas);