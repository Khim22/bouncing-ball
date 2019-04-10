import Ball from './Objects/ball.js'
import System from './Objects/system.js'

((window, document) => {
  var init = () => {
    //scale- 1px : 1cm
    var canvas = window.bouncingball;
    window.context = canvas.getContext("2d", { alpha: false });
  };
  window.onload = init;
  window.sys = new System();
  // window.balls = [];
})(window, document);

window.drawBall = (canvas, context) => {
  // window.ball = new Ball(2, 50)
  window.sys.addBall(
    new Ball()
  )
  // window.sys.createRandomBall();

  window.sys.draw(canvas, context)
  //ball.drawBall(canvas, context);
}; 

window.moveBall = (canvas) => {
  let btn = document.getElementById('moveBall')
  btn.disabled = true
  btn.style.background = '#303030'

  window.sys.fall(canvas)
  //window.ball.freeFall(canvas)
};
