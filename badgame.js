// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = $(window).width();
canvas.height = $(window).height();
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "http://www.crazymonkeydefense.com/wp-content/uploads/2014/03/black-hd-background-background-wallpapers-abstract-photo-cool-black-background.jpg";
//http://www.lostdecadegames.com/demos/simple_canvas_game/images/background.png
//http://www.crazymonkeydefense.com/wp-content/uploads/2014/03/black-hd-background-background-wallpapers-abstract-photo-cool-black-background.jpg

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "http://i.imgur.com/oZPX0bb.png";
//http://www.lostdecadegames.com/demos/simple_canvas_game/images/hero.png


// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
//http://www.lostdecadegames.com/demos/simple_canvas_game/images/monster.png


// Game objects
var hero = {
	speed: 500, // movement in pixels per second
	x:canvas.width / 2,
	y:canvas.height / 2
};
var monster = {
	speed:25,
};


// Walls
var wallLeft={
	x:0,
	y:0,
	height:canvas.width,
	width:1
}


var monstersCaught = 0;





// Audio volume
$(document).ready(function(){
	$('audio').prop("volume", .3);
})

function changeVolume(volume){
	$('audio').prop("volume", volume/10);
}



// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	/*hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;*/

	// Monster image
	//http://www.lostdecadegames.com/demos/simple_canvas_game/images/monster.png
	randy=Math.floor(Math.random()*3);
	if(randy==1){
		monsterImage.src = "http://i.imgur.com/pflhY0z.png";
	}else if(randy==2){
		monsterImage.src = "http://i.imgur.com/2HwKjLY.png";
	}else{
		monsterImage.src = "http://i.imgur.com/ipB2W2A.png";
	}

	// Throw the monster somewhere on the screen randomly
	monster.x = 64 + (Math.random() * (canvas.width - 128));
	monster.y = 64 + (Math.random() * (canvas.height - 128));
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown || 87 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
		heroImage.src = "http://i.imgur.com/ld2k1Ba.png";
	}
	if (40 in keysDown || 83 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
		heroImage.src = "http://i.imgur.com/azsvBrY.png";
	}
	if (37 in keysDown || 65 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
		heroImage.src = "http://i.imgur.com/aS3kDkT.png";
	}
	if (39 in keysDown || 68 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
		heroImage.src = "http://i.imgur.com/RPZ43WI.png";
	}
	if (32 in keysDown) { // Player pressing space
		$("#scream").trigger('play');
	}

	// Are they touching?
	if (
		hero.x <= (monster.x + 110)
		&& monster.x <= (hero.x + 110)
		&& hero.y <= (monster.y + 110)
		&& monster.y <= (hero.y + 110)
	) {
		$("#monsterDeath").trigger('play');
		++monstersCaught;
		reset();
	}


	// Monster moves away
	if(monster.y<hero.y){
		monster.y-=monster.speed * modifier;
	}else{
		monster.y+=monster.speed * modifier;
	}
	if(monster.x<hero.x){
		monster.x-=monster.speed * modifier;
	}else{
		monster.x+=monster.speed * modifier;
	}
	// Monster jiggle
	yRand=Math.random();
	xRand=Math.random();
	if(yRand>.5){
		monster.y-=monster.speed * modifier*1.5;
	}else{
		monster.y+=monster.speed * modifier*1.5;
	}
	if(xRand>.5){
		monster.x-=monster.speed * modifier*1.5;
	}else{
		monster.x+=monster.speed * modifier*1.5;
	}

	// Walls
	if (hero.x < -20) {
		hero.x+=hero.speed*modifier;
	}else if(hero.x>canvas.width-110){
		hero.x-=hero.speed*modifier;
	}else{}

	if (hero.y < -10) {
		hero.y+=hero.speed*modifier;
	}else if(hero.y>canvas.height-118){
		hero.y-=hero.speed*modifier;
	}else{}

	if (monster.x < 0) {
		monster.x+=monster.speed*modifier;
	}else if(monster.x>canvas.width-64){
		monster.x-=monster.speed*modifier;
	}else{
		yRand=Math.random();
		xRand=Math.random();
		if(yRand>.5){
			monster.y-=monster.speed * modifier/5;
		}else{
			monster.y+=monster.speed * modifier/5;
		}
		if(xRand>.5){
			monster.x-=monster.speed * modifier/5;
		}else{
			monster.x+=monster.speed * modifier/5;
		}
	}

	if (monster.y < 0) {
		monster.y+=monster.speed*modifier;
	}else if(monster.y>canvas.height-64){
		monster.y-=monster.speed*modifier;
	}else{
		yRand=Math.random();
		xRand=Math.random();
		if(yRand>.5){
			monster.y-=monster.speed * modifier/5;
		}else{
			monster.y+=monster.speed * modifier/5;
		}
		if(xRand>.5){
			monster.x-=monster.speed * modifier/5;
		}else{
			monster.x+=monster.speed * modifier/5;
		}
	}

	if(hero.x>canvas.width){
		hero.x-=hero.speed*modifier*10;
	}else{}
	if(hero.y>canvas.height){
		hero.y-=hero.speed*modifier*10;
	}else{}

	if(monster.x>canvas.width){
		monster.x-=monster.speed*modifier*100;
	}else{}
	if(monster.y>canvas.height){
		monster.y-=monster.speed*modifier*100;
	}else{}



};

// Timer
var time=0;
setInterval(function(){
	time++
},1000);

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "#f00";
	ctx.font = "15px Comic Sans MS";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Beasties caught: " + monstersCaught, 5, 5);
	ctx.fillText("Time: "+time+" seconds", 5, 20);
	ctx.fillText("Score per minute: "+ Math.floor(monstersCaught/(time/60)), 5, 34);
	ctx.fillText("FPS: Like fucking 1200", 5, 50);
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
reset();
main();

// Window resize
/*$(document).ready(function() {
    var bodyheight = $(document).height();
    canvas.height(bodyheight);
});*/
$( window ).resize(function() {
	/*canvas.width = $(window).width();
	var bodyheight = $(document).height();
    canvas.height(bodyheight);*/
	ctx.canvas.width  = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	render();
});









//EMERGENCY BACKUP


/*// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "http://www.lostdecadegames.com/demos/simple_canvas_game/images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "http://www.lostdecadegames.com/demos/simple_canvas_game/images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "http://www.lostdecadegames.com/demos/simple_canvas_game/images/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {};
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}

	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		reset();
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
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
reset();
main();
*/
