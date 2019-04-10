export const randomInt = (max) =>{
    return Math.floor(Math.random() * Math.floor(max))
}

export const randomcolor = () => {
    return `rgb(${randomInt(255)}, ${randomInt(255)}, ${randomInt(255)}, ${Math.random() + 0.3})`
  }

export const randomStartPosition = (radius, windowLength) =>{
    let min = radius
    let max = windowLength - radius
    return Math.floor(Math.random()*(max-min+1) + min);
}

export const g = 9.81
export const SCALE = 0.01
export const windowHeight = 500
export const windowWidth = 1300;

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
            let isDrawBall = ball.drawBall(canvas)
            console.log('isDrawBall::'+ isDrawBall)
            if(!isDrawBall){
                console.log("this.balls::")
                console.log(this.balls)
            }
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


