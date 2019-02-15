((window, document) => {
  init = () => {
    canvas = document.getElementById("bouncingball");
    this.context = canvas.getContext("2d", { alpha: false });
  };
  window.onload = init;
})(window, document);

const drawBall = (canvas, context) => {
  ball = new Ball(2, 50)
  ball.drawBall(canvas, context);
}; 

const moveBall = (canvas) => {
  ball.freeFall(canvas)
};

class Ball{
  constructor(mass, radius, color= 'blue'){
    this.mass = mass;
    this.radius = radius;
    this.color = color
  }

  drawBall(canvas,x=50, y=50){
    console.log('x: ' + x)
    console.log('y: ' + y)
    let ctx = canvas.getContext("2d", { alpha: false });
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    if(y >= canvas.height - this.radius){
      let ballTopY = y - this.radius
      let newBallY = 0.5*(canvas.height - ballTopY)
      let ellipseCentre = ballTopY + newBallY
      let expansionX = this.radius - newBallY
      ctx.ellipse(x, ellipseCentre, this.radius + expansionX, newBallY , 0, 0, 2 * Math.PI);      
    }
    else{
      ctx.ellipse(x, y, this.radius, this.radius, 0, 0, 2 * Math.PI);
    }
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }

  freeFall(canvas){
    this.x = 50;
    this.y = 50;
    this.dy = 0;
    this.dx = 8;
    this.g = 1; 
    this.e = 0.9;

    setInterval(() => { 
      if(this.y >= canvas.height -50 || this.y < 50 ){
        this.dy = -this.dy * this.e;
      } 
      else{
        this.dy+= this.g;
      }

      if(this.x >= canvas.width - 50 || this.x < 50){
        this.dx = -this.dx * this.e;
      }

      this.y += this.dy;
      this.x += this.dx
      console.log('dy : ' +  this.dy)
      console.log('dx : ' +  this.dx)
      this.drawBall(canvas, this.x , this.y);
    }, 10);
  }
}
