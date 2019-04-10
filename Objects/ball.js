import { randomcolor, randomStartPosition } from './system.js'
import { randomInt } from './system.js'
import { g, SCALE, windowHeight, windowWidth } from './system.js'

export default class Ball{
    constructor(mass=randomInt(1000), 
                 radius=randomInt(Math.min(windowHeight, windowWidth)/4), 
                 color = randomcolor(),
                 x=randomStartPosition(randomInt(200),windowWidth),
                 y=randomStartPosition(randomInt(200),windowHeight),
                 e=Math.random(), v_x=randomInt(10), v_y=0, gravity=true){
      this.radius = radius;
      this.x = randomStartPosition(this.radius,windowWidth)
      this.y = randomStartPosition(this.radius,windowHeight)
      this.mass = mass; 
      this.color = color
      this.e = e
      this.a_y = 0
      this.a_x = 0
      this.v_y = v_y
      this.v_x = v_x
      this.dt = 0.01
      this.gravity = gravity
      this.g = 9.81
      this.dy = 0;
      this.dx = v_x;
      console.log(`radius:${this.radius}| startX: ${this.x} | startY: ${this.y} |  `)
    }
  
    drawBall(canvas,x=this.x, y=this.y){
      let ctx = canvas.getContext("2d", { alpha: false });
      ctx.fillStyle = this.color;
      ctx.beginPath();
      if(this.hasCollided(canvas,this.radius,x,y)){
        let side = this.hasCollided(canvas,this.radius,x,y)
        let isBallCompressed = this.drawCompressedBall(side, x, y, this.radius, canvas)
        if(!isBallCompressed)
          return false
      }
      else{
        ctx.ellipse(this.x, this.y, this.radius, this.radius, 0, 0, 2 * Math.PI);
      }
      // ctx.stroke();
      ctx.fill();
      ctx.closePath();
      return true
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

      let cd = this.dragCoefficient(this.v_y)
      let drag = this.dragForce(cd, this.v_y) 
        let netforce = 0
        if(!this.isStoppedBouncing(this.v_x, this.y, canvas)){
          let collision = this.hasCollided(canvas, this.radius, this.x, this.y)
          
          if(collision){
            this.switchDirection(collision, canvas)
          } 
          else{
            netforce = this.mass*g - drag
          }
          let b = this.updateState(0, netforce)
          this.drawBall(canvas, this.x , this.y);
          this.status(collision)

        }
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
        let gap = -this.dx * this.e
        let ellipseCentre = 0.5*(this.x + this.radius)
        if(Math.round(gap + ellipseCentre) >= this.radius)
          this.dx = -this.dx * this.e;
        
      }
    }

    drawCompressedBall(side , x, y, radius, canvas){
      let ctx = canvas.getContext("2d", { alpha: false })
      let newX, newY, newXLength, newYLength = 0;
        if(side.includes('bottomy')){
            let ballTopY = y - radius
            let newBallY = 0.5*(canvas.height - ballTopY)
            let ellipseCentre = ballTopY + newBallY
            let expansionX = radius - newBallY

            newX = x
            newY = ellipseCentre
            newXLength = radius + expansionX
            newYLength = newBallY
            // console.log(`Bottom: ctx.ellipse(${x}, ${ellipseCentre}, ${radius + expansionX}, ${newBallY} , 0, 0, 2 * Math.PI)`)
            // ctx.ellipse(x, ellipseCentre, radius + expansionX, newBallY , 0, 0, 2 * Math.PI);
        }
        if(side.includes('rightx')){
            let ballLeftX = x - radius
            let newBallX = 0.5*(canvas.width - ballLeftX)
            let ellipseCentre = ballLeftX + newBallX
            let expansionY = radius - newBallX
            
            newX = ellipseCentre
            newY = y
            newXLength = newBallX
            newYLength = radius + expansionY
            console.log(`Right:ctx.ellipse(${ellipseCentre}, ${y}, ${newBallX}, ${radius + expansionY} , 0, 0, 2 * Math.PI)`)
            // ctx.ellipse(ellipseCentre, y, newBallX, radius + expansionY , 0, 0, 2 * Math.PI);
        }
        if(side === 'topy'){

        }
        if(side.includes('leftx')){
          let ballRightX = x + this.radius > 0 ? x + this.radius : -(x + this.radius)
          let newBallX = 0.5*(ballRightX)
          let ellipseCentre = newBallX
          let expansionY = radius - newBallX
          
          newX = ellipseCentre
          newY = y
          newXLength = newBallX
          newYLength = radius + expansionY
          console.log(`Left: ctx.ellipse(${ellipseCentre}, ${y}, ${newBallX}, ${radius + expansionY} , 0, 0, 2 * Math.PI)`)
          // ctx.ellipse(ellipseCentre, y, newBallX, radius + expansionY , 0, 0, 2 * Math.PI);
          
        }
        if(newXLength > 0 && newYLength > 0){
          ctx.ellipse(newX, newY, newXLength, newYLength , 0, 0, 2 * Math.PI);
          return true
        }
        else{
          return false
        }
        
    }

    updateState(force_x, force_y){
      try{
        let a_y = force_y/this.mass
        let dvy = a_y * this.dt
        let a_x = 0
        let dvx = a_x * this.dt
        this.v_y += dvy
        this.dy+= dvy * this.dt / SCALE;
        this.dx+= dvx * this.dt / SCALE;
        this.y += this.dy;
        this.x += this.dx

        return true
      }
      catch(err){
        console.log(err)
      }
      return false
    }

    getState(){
        return {
          x : this.x,
          y : this.y,
          v_x : this.v_x,
          v_y : this.v_y,
          a_x : this.a_x,
          a_y : this.a_y,
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
