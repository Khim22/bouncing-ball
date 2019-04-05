import Ball from './Objects/ball.js'
import System from './Objects/system.js'

((window, document) => {
  var init = () => {
    //scale- 1px : 1cm
    var canvas = window.bouncingball;
    console.log(canvas)
    window.context = canvas.getContext("2d", { alpha: false });
  };
  window.onload = init;
  window.sys = new System();
  // window.balls = [];
})(window, document);

window.drawBall = (canvas, context) => {
  window.ball = new Ball(2, 50)
  // window.balls.push(window.ball)
  window.sys.addBall(
    new Ball(1,20,'White', 80, 100, 0.6,2,0)
  )
  window.sys.addBall(
    new Ball(3,50,'Red', 100, 50, 0.9,1,0)
  )

  window.sys.draw(canvas, context)
  //ball.drawBall(canvas, context);
}; 

window.moveBall = (canvas) => {
  window.sys.fall(canvas)
  window.ball.freeFall(canvas)
};
