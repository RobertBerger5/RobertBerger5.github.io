var canvas = document.getElementById("titleAnimation");
var ctx;

$(document).ready(function () {
	$('[data-toggle="tooltip"]').tooltip();
	$('[data-toggle="popover"]').popover();
	//TODO: have it calculate the tallest item in the carousel and make all carousel items that height

	//var canvas=document.getElementById("titleAnimation");
	if (canvas != null) {
		canvas.width = $('#title').width();//TODO: onResize or something
		canvas.height = $('#title').outerHeight(true);//probably not gonna resize the height unless they go out of their way to do so...


		if (canvas.getContext) {
			ctx = canvas.getContext('2d');
			animate();
		} else {
			console.log("Either canvas is not supported by your browser or something went wrong, sorry.");
		}
	} else {
		throw '(canvas is commented out, can\'t find it)';
	}
});


var bubbles = [];
var BUBBLE_NUM = 50;
var BUBBLE_SIZE_MAX = Math.min(canvas.width, canvas.height) * .1;
var BUBBLE_SIZE_MIN = Math.min(canvas.width, canvas.height) * .01;
var BUBBLE_SPEED_MAX = 5;
var BUBBLE_FREQUENCY = 50;
var BUBBLE_O_SPEED_MAX = .001;
var BUBBLE_O_SPEED_MIN = .0001;
var DRAW_SPEED = 50;


var Bubble = {//x,y,vx,vy,o,vo,r
	x: Math.random() * (canvas.width + BUBBLE_SIZE_MAX * 2) - BUBBLE_SIZE_MAX,
	y: Math.random() * (canvas.height + BUBBLE_SIZE_MAX * 2) - BUBBLE_SIZE_MAX,
	vx: Math.random() * BUBBLE_SPEED_MAX * 2 - BUBBLE_SPEED_MAX,
	vy: Math.random() * BUBBLE_SPEED_MAX * 2 - BUBBLE_SPEED_MAX,
	o: .5, vo: .1,
	//vo:(Math.random()+BUBBLE_O_SPEED_MIN)*(BUBBLE_O_SPEED_MAX-BUBBLE_O_SPEED_MIN),
	r: (Math.random() + BUBBLE_SIZE_MIN) * (BUBBLE_SIZE_MAX - BUBBLE_SIZE_MIN),
	shit: function (test) {
		console.log(test + " bubbles");
	},
	move: function () {//javascript is wack
		if (this.o >= 1) {
			this.vo *= -1;
		} else if (this.o < 0) {
			this.o = 0;
			this.vo = 0;
		} else if (this.o == 0 && Math.floor(Math.random() * BUBBLE_FREQUENCY) == 0) {
			this.vo = (Math.random() + BUBBLE_O_SPEED_MIN) * (BUBBLE_O_SPEED_MAX - BUBBLE_O_SPEED_MIN);
		}
		this.o += this.vo;
		this.x += this.vx;
		this.y += this.vy;
		if (this.x < this.r * -2 || this.x > canvas.width + this.r * 2) {
			if ((this.x < this.r * -2 && this.vx < 0) || (this.x > canvas.width + this.r * 2 && this.vx > 0)) {
				this.vx *= -1;
			}
			this.o = 0;
			this.vo = 0;
		}
		//if it goes past the edge, make it invisible and bounce back
		if (this.y < this.r * -2 || this.y > canvas.height + this.r * 2) {
			if ((this.y < this.r * -2 && this.vy < 0) || (this.y > canvas.height + this.r * 2 && this.vy > 0)) {
				this.vy *= -1;
			}
			this.o = 0;
			this.vo = 0;
		}
		return 0;
	}
}

function draw() {
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#0000ff";
	for (var i = 0; i < BUBBLE_NUM; i++) {
		b = bubbles[i];
		b.move();
		ctx.beginPath();
		ctx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);
		ctx.fill();
	}
	return;
}


function animate() {
    /*TODO: I kinda wanna try like a glass explosion kinda thing.
      start with something...a circle that gets smaller as things explode from it?
      then have little triangles that follow my color scheme shoot out from it
      all start with the same velocity (???) and have em all spin kinda?
      
      if that idea goes south, just have colored bubbles moving around very slowly...
    */
	for (var i = 0; i < BUBBLE_NUM; i++) {//x,y,vx,vy,o,vo,r
		bubbles.push(Bubble);
	}
	setInterval(draw, DRAW_SPEED);
}
