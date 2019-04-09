const randomInt = (max) =>{
    return Math.floor(Math.random() * Math.floor(max))
}

export const randomcolor = () => {
    return `rgb(${randomInt(255)}, ${randomInt(255)}, ${randomInt(255)}, ${Math.random() + 0.3})`
  }

export const g = 9.81
export const SCALE = 0.01

export default class System{
    constructor(){
        this.balls = []
    }

    addBall(ball){
        this.balls.push(ball)
    }

    draw(canvas){
        let ctx = canvas.getContext("2d", { alpha: false });
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.balls.forEach(ball => {
            ball.drawBall(canvas)
        });
    }

    fall(canvas){
        var fall = (timestamp)=>{
            let ctx = canvas.getContext("2d", { alpha: false });
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.balls.forEach(ball => {
                ball.freeFall(canvas)
            });
            requestAnimationFrame(fall)
        }
        requestAnimationFrame(fall)

    }

}


