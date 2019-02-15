((window, document) => {
  init = () => {
    //scale- 1px : 1cm
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
  constructor(mass=1, radius=50, color= this.randomColor(), e=0.9){
    this.mass = mass;
    this.radius = radius;
    this.color = color
    this.e = e
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
    this.dx = 1;
    this.g = 0.0981; 
    var count = 0

    setInterval(() => { 
      console.log(this.dy)
      if(!this.isStoppedBouncing(this.dy, this.y, canvas)){
        if(this.y >= canvas.height - this.radius || this.y < this.radius){
            let gap = -this.dy * this.e + canvas.height
            if(Math.round(gap) <= canvas.height)
              this.dy = -this.dy * this.e;
            count++
            console.log('bounce:' + count)
            let bounce = document.getElementById("bounce")
            bounce.innerHTML = count

              let y_elem = document.getElementById("y")
              y_elem.innerHTML = this.y
              let dy_elem = document.getElementById("dy")
              dy_elem.innerHTML = this.dy
        } 
        else{
          this.dy+= this.g;
        }
  
        if(this.x >= canvas.width - this.radius || this.x < this.radius){
          this.dx = -this.dx * this.e;
        }
  
        this.y += this.dy;
        this.x += this.dx
        console.log('dy : ' +  this.dy)
        console.log('dx : ' +  this.dx)
        this.drawBall(canvas, this.x , this.y);
      }
      else{
        console.log('dy : ' +  this.dy)
        console.log('bounce stopped:' + count)
      }
    }, 10);
  }

  randomColor(){
    return `rgb(${this.randomInt(255)}, ${this.randomInt(255)}, ${this.randomInt(255)}, ${Math.random() + 0.3})`
  }

  randomInt(max){
    return Math.floor(Math.random() * Math.floor(max))
  }

  isStoppedBouncing(dy,y, canvas){
    let cutoff_min_velocity = 0.001
    return Math.round(y + this.radius) >= canvas.height && Math.abs(dy) < cutoff_min_velocity
  }
}
