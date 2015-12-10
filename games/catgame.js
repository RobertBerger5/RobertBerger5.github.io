// Create the canvas
//var canvas = document.createElement("canvas");
var canvas=document.querySelector("canvas");
var ctx = canvas.getContext("2d");
canvas.width = $(window).width();
canvas.height= $(window).height();
//document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "http://www.imagemagick.org/image/black.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "http://i.imgur.com/K6s3q7t.png";
//http://a.deviantart.net/avatars/d/j/djpgirl.gif
//http://emojipedia.org/wp-content/uploads/2014/04/1f408-google-android.png

// ball image
/*var ballReady = false;
var ballImage = new Image();
ballImage.onload = function () {
	ballReady = true;
};
ballImage.src = "http://en.xn--icne-wqa.com/images/icones/1/5/animals-mouse.png";*/

// Game objects
var hero = {
	speed: 500, // movement in pixels per second
	x: canvas.width/2,
	y: canvas.height-100
};

// .push() magic
var mice=[];
var mouse=function(x,speed){
	return{
		x:x,
		speed:speed,
		y:0
	}
}

// mouse x and y test
for(var i=0;i<10;i++){
	//console.log("pushin");
	makeMouse();
}

// Variables
var miceCaught = 0;
var time=0;
var mouseNumber=0;
var lost=false;
var paused=false;
var dropSpeed=75;
var startTime = new Date().getTime();

// Functions
function makeMouse(){
	var xCo=Math.random()*canvas.width;
	var speed=Math.random()*10+10;
	mice.push(mouse(xCo,speed));
	mouseNumber++;
	//console.log(speed);
}

function lose(){
	loseTime=new Date().getTime();
	lost=true;
	//document.body.innerHTML="<p class='youSuck'>Your time was: "+time/100+" seconds</p>";
	document.body.innerHTML="<p class='youSuck'>Your time was: "+(loseTime-startTime)/1000+" seconds</p>";
	//console.log(loseTime-startTime);
}

function pauseGame(){
	console.log("paused");
}

function resumeGame(){
	console.log("resumed");
}

// Single Key Events
$( "body" ).on( "keydown", function( event ) {
	if(event.which=="32"&&paused==false&&lost==false){
		pauseGame() //pause
	}else if(event.which=="32"&&paused==true&&lost==false){
		resumeGame() //resume
	}else if(event.which=="32"&&paused==false&&lost==true){
		location.reload();
	}else if(event.which=="32"&&paused==false&&lost==true){
		location.reload();
	}
});

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a ball
var reset = function () {
	miceCaught++;
};

// Update game objects
var update = function (modifier) {
	/*if (38 in keysDown||87 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown||83 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}*/
	if (37 in keysDown||65 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
		heroImage.src="http://i.imgur.com/K6s3q7t.png";
		//http://i.imgur.com/K6s3q7t.png
	}
	if (39 in keysDown||68 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
		heroImage.src="http://i.imgur.com/BRT8Blj.png"
		//http://i.imgur.com/BRT8Blj.png
	}

	// Are they touching?, SOMEHOW GET THIS TO WORK WITH THE ARRAY SHIT
	/*if (
		hero.x <= (ball.x + 32)
		&& ball.x <= (hero.x + 32)
		&& hero.y <= (ball.y + 32)
		&& ball.y <= (hero.y + 32)
	) {
		++miceCaught;
		reset();
	}*/

	// Cat touching screen edge
	if (hero.x < -20) {
		hero.x+=hero.speed*modifier;
	}else if(hero.x>canvas.width-110){
		hero.x-=hero.speed*modifier;
	}else{}

	// Drop touching cat
	for(var a in mice){
		//console.log(dots[a].x);
		if (
			hero.x <= (mice[a].x + 10)
			&& mice[a].x <= (hero.x + 118)
			&& hero.y <= (mice[a].y + 10)
			&& mice[a].y <= (hero.y + 118)
			&&lost==false
		){
			//console.log("touched dot");
			lose();
		}
	}

	// Make mice fall
	for(var i=0;i<mouseNumber;i++){
		//this.y =- this.speed*modifier;
		//console.log(mouse.y);
		mice[i].y+=mice[i].speed;
	}



};

// Timer, FOR SOME REASON IT NEEDS THIS TO DROP
var time=0;
if(paused==false&&lost==false){
	setInterval(function(){
		makeMouse();
	},dropSpeed);

	setInterval(function(){
		time++
	},10);
}

// Draw everything
var render = function () {
	/*if (bgReady) {
		ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
	}*/
	ctx.fillStyle="#fff";
	ctx.fillRect(0,0,canvas.width,canvas.height);

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	/*if (ballReady) {
		ctx.drawImage(ballImage, ball.x, ball.y);
	}*/

	// Draw mice
	var dotColor;
	if(time%5==0){
		dotColor="#99f";
	}else{
		dotColor="#66f";
	}
	ctx.fillStyle=dotColor;
	for(var a in mice){
		ctx.fillRect(mice[a].x, mice[a].y, 10, 10);
	};

	// Score
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.font = "25px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	//ctx.fillText("Time: "+time/100+" seconds", 5, 5);
	ctx.fillText("Time: "+(Date.now()-startTime)/1000+" seconds", 5, 5);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
//reset();
main();
