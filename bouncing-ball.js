import Ball from './Objects/ball.js'

((window, document) => {
  var init = () => {
    //scale- 1px : 1cm
    var canvas = window.bouncingball;
    console.log(canvas)
    window.context = canvas.getContext("2d", { alpha: false });
  };
  window.onload = init;
})(window, document);

window.drawBall = (canvas, context) => {
  window.ball = new Ball(2, 50)
  ball.drawBall(canvas, context);
}; 

window.moveBall = (canvas) => {
  window.ball.freeFall(canvas)
};
