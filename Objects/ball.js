import { randomcolor } from './system.js'
import { g, SCALE } from './system.js'

export default class Ball{
    constructor(mass=1, radius=50, color = randomcolor(), e=0.9, v_x=0, v_y=0){
      this.mass = mass;
      this.radius = radius;
      this.color = color
      this.e = e
      this.a_y = 0
      this.a_x = 0
      this.v_y = v_y
      this.v_x = 1
      this.dt = 0.01

    }
  
    drawBall(canvas,x=50, y=50){
      console.log('x: ' + x)
      console.log('y: ' + y)
      let ctx = canvas.getContext("2d", { alpha: false });
      ctx.clearRect(0, 0, canvas.width, canvas.height);
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
      this.x = 50;
      this.y = 50;
      this.dy = this.v_y;
      this.dx = this.v_x;
      this.g = 9.81;
      this.a_y = g
      let cd = this.dragCoefficient(this.v_y)
      var count = 0
    //   console.log('cd')
    //   console.log(cd)
      let drag = this.dragForce(cd, this.v_y)
    //   console.log('drag')
    //   console.log(drag)
  
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
            this.a_y = g - drag/this.mass
            let v_i = this.v_y
            this.v_y += this.a_y * this.dt
            let dv = this.v_y - v_i
            //this.dy = this.v_y * this.dt
            this.dy+= dv * this.dt / SCALE;
          }
    
          if(this.x >= canvas.width - this.radius || this.x < this.radius){
            this.dx = -this.dx * this.e;
          }
    
          this.y += this.dy;
          this.x += this.dx
          this.v_y = this.dy * 0.2
          console.log('dy : ' +  this.dy)
          console.log('dx : ' +  this.dx)
          console.log('cd: ' + cd)
          this.drawBall(canvas, this.x , this.y);
        }
        else{
          console.log('dy : ' +  this.dy)
          console.log('bounce stopped:' + count)
        }
      }, 10);
    }

    hasCollided(canvas,radius,x,y){
        if(y >= canvas.height - radius)
            return 'bottomy'
        else if(x >= canvas.width - radius)
            return 'rightx'
        else if(y < radius)
            return 'topy'
        else if(x < radius)
            return 'leftx'
        else
            return false
    }

    drawCompressedBall(side , x, y, radius, canvas){
        if(side === 'bottomy'){
            let ballTopY = y - radius
            let newBallY = 0.5*(canvas.height - ballTopY)
            let ellipseCentre = ballTopY + newBallY
            let expansionX = radius - newBallY
            let ctx = canvas.getContext("2d", { alpha: false })
            ctx.ellipse(x, ellipseCentre, radius + expansionX, newBallY , 0, 0, 2 * Math.PI);
        }
        if(side === 'rightx'){
            let ballLeftX = x - radius
            let newBallX = 0.5*(canvas.width - ballLeftX)
            let ellipseCentre = ballLeftX + newBallX
            let expansionY = radius - newBallX
            let ctx = canvas.getContext("2d", { alpha: false })
            ctx.ellipse(ellipseCentre, y, newBallX, radius + expansionY , 0, 0, 2 * Math.PI);
        }
        if(side === 'topy'){

        }
        if(side === 'leftx'){

        }
    }

  }
