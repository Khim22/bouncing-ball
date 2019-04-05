import { randomcolor } from './system.js'
import { g, SCALE } from './system.js'

export default class Ball{
    constructor(mass=1, radius=50, color = randomcolor(), x=50, y=50, e=0.9, v_x=0, v_y=0, gravity=true){
      this.x = x
      this.y = y
      this.mass = mass;
      this.radius = radius;
      this.color = color
      this.e = e
      this.a_y = 0
      this.a_x = 0
      this.v_y = v_y
      this.v_x = 1
      this.dt = 0.01
      this.gravity = gravity
      this.g = 9.81
      this.dy = 0;
      this.dx = 1;

    }
  
    drawBall(canvas,x=50, y=50){
      let ctx = canvas.getContext("2d", { alpha: false });

      // ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = this.color;
      ctx.beginPath();
      if(this.hasCollided(canvas,this.radius,x,y)){
        let side = this.hasCollided(canvas,this.radius,x,y)
        this.drawCompressedBall(side, x, y, this.radius, canvas)   
      }
      else{
        ctx.ellipse(x, y, this.radius, this.radius, 0, 0, 2 * Math.PI);
      }
      ctx.stroke();
      ctx.fill();
      ctx.closePath();
    }

  
    isStoppedBouncing(dy,y, canvas){
      let cutoff_min_velocity = 0.001
      return Math.round(y + this.radius) >= canvas.height && Math.abs(dy) < cutoff_min_velocity
    }
  
    dragCoefficient(v){ 
      let mu = 18.6 * Math.pow(10,-6)
      let Re = v * 2 * this.radius / mu
      if(Re!= 0)
        return 777 * ( (669806/876) + (114976/1155) * Re + (707/1380) * Re * Re) /  (646 * Re * ((32896/952) + (924/643) * Re + (1/385718) * Re * Re))
      else
        return 0 
    }
  
    dragForce(cd,v, rho = 1.225){
      return 0.5 * rho * Math.pow(v, 2) * cd;
    }
  
    freeFall(canvas){

      // setInterval(() => { 

      let cd = this.dragCoefficient(this.v_y)
      var count = 0
      let drag = this.dragForce(cd, this.v_y) 
        let netforce = 0
        if(!this.isStoppedBouncing(this.v_x, this.y, canvas)){
          let collision = this.hasCollided(canvas, this.radius, this.x, this.y)
          if(collision){
            this.switchDirection(collision, canvas)
          } 
          else{
            netforce = this.mass*g - drag
            console.log(`netforce:${netforce}`)  
          }
          let b = this.updateState(0, netforce)

          this.drawBall(canvas, this.x , this.y);
          this.status(collision)

        }
      // }, 10);
    }

    hasCollided(canvas,radius,x,y){
        let collisionside = ''
        if(y >= canvas.height - radius)
          collisionside += 'bottomy:'
        if(x >= canvas.width - radius)
          collisionside += 'rightx:'
        if(y < radius)
          collisionside +='topy:'
        if(x < radius)
          collisionside +='leftx:'
        return collisionside
    }

    switchDirection(collision, canvas){
      if(collision.includes('bottomy')){
        let gap = -this.dy * this.e + canvas.height
        if(Math.round(gap) <= canvas.height)
          this.dy = -this.dy * this.e;
      }
      if(collision.includes('rightx')){
        let gap = -this.dx * this.e + canvas.width
        if(Math.round(gap) <= canvas.width)
          this.dx = -this.dx * this.e;
      }
      if(collision.includes('leftx')){
        this.dx = -this.dx * this.e;
      }
    }

    drawCompressedBall(side , x, y, radius, canvas){
        if(side.includes('bottomy')){
            let ballTopY = y - radius
            let newBallY = 0.5*(canvas.height - ballTopY)
            let ellipseCentre = ballTopY + newBallY
            let expansionX = radius - newBallY
            let ctx = canvas.getContext("2d", { alpha: false })
            ctx.ellipse(x, ellipseCentre, radius + expansionX, newBallY , 0, 0, 2 * Math.PI);
        }
        if(side.includes('rightx')){
            let ballLeftX = x - radius
            let newBallX = 0.5*(canvas.width - ballLeftX)
            let ellipseCentre = ballLeftX + newBallX
            let expansionY = radius - newBallX
            let ctx = canvas.getContext("2d", { alpha: false })
            ctx.ellipse(ellipseCentre, y, newBallX, radius + expansionY , 0, 0, 2 * Math.PI);
        }
        if(side === 'topy'){

        }
        if(side.includes('leftx')){
          let ballRightX = x + radius
          let newBallX = 0.5*(ballRightX)
          let ellipseCentre = newBallX
          let expansionY = radius - newBallX
          let ctx = canvas.getContext("2d", { alpha: false })
          ctx.ellipse(ellipseCentre, y, newBallX, radius + expansionY , 0, 0, 2 * Math.PI);
        }
    }

    updateState(force_x, force_y){
      try{
        let a_y = force_y/this.mass
        let dv = a_y * this.dt
        let a_x = 0
        this.v_y += dv
        this.dy+= dv * this.dt / SCALE;

        this.y += this.dy;
        this.x += this.dx
        this.v_y = this.dy * 0.2

        return true
      }
      catch(err){
        console.log(err)
      }
      return false
    }

    getState(){
        return {
          x : x,
          y : y,
          v_x : v_x,
          v_y : v_y,
          a_x : a_x,
          a_y : a_y,
      }
    }

    status(col){
      let bounce = document.getElementById("bounce")
      bounce.innerHTML = col

      document.getElementById("y").innerHTML = `y: ${this.y}`      
      document.getElementById("dy").innerHTML = `dy: ${this.dy}`
      document.getElementById("x").innerHTML = `x: ${this.x}`
      document.getElementById("dx").innerHTML = `dx: ${this.dx}`
    }

  }
