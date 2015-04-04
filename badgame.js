// Mobile
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	var mobile=true;
	console.log(mobile);
}else{
	var mobile=false;
	console.log(mobile);
}
if(mobile==true){
	inputZ = document.createElement("input");
	document.querySelector('body').appendChild(inputZ);
}

// Create the canvas
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
canvas.width = $(window).width();
if(mobile==false){
	canvas.height = $(window).height();
}else{
	canvas.height = $(window).height()/2;
}
//divthing.appendChild(canvas);

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
heroImage.src = "http://i.imgur.com/ld2k1Ba.png";
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

var monstersCaught = 0;

var jiggle=1.5;

// Audio volume
$(document).ready(function(){
	$('audio').prop("volume", .5);
})

function changeVolume(volume){
	$('audio').prop("volume", volume/10);
}


// Fuck shit up
var hurd=false;
function hard(){
	monster.speed=200;
	jiggle=5;
	hero.speed=250;
	bgImage.src = "http://thedailyblog.co.nz/wp-content/uploads/2015/02/hell-background.jpg";
	/*heroImage.src="https://cdn4.iconfinder.com/data/icons/dot/64/man_person_mens_room.png";*/
	monsterImage.src="http://icons.iconarchive.com/icons/martin-berube/character/256/Devil-icon.png";
	hurd=true;
}

function easy(){
	monster.speed=25;
	jiggle=1.5;
	hero.speed=500;
	bgImage.src = "http://www.crazymonkeydefense.com/wp-content/uploads/2014/03/black-hd-background-background-wallpapers-abstract-photo-cool-black-background.jpg";
	/*heroImage.src="https://cdn4.iconfinder.com/data/icons/dot/64/man_person_mens_room.png";*/
	monsterImage.src="http://i.imgur.com/pflhY0z.png";
	hurd=false;
}

// Random number for batman loud sound surprise
randNum=Math.floor(Math.random()*10);

// Pause button
var paused=false;


// New shit function
/*function newShit(x,y){
	ctx.fillRect(x, y, 10, 10);
}


var shits=[]
for(i=0;i<1000;i++){
	shits[i]= new newShit(Math.random()*canvas.height,Math.random()*canvas.width)
}*/


function holdup(){
	paused=true;
	hero.speed=0;
	monster.speed=0;
	document.getElementById("background").pause();
}

function keepgoin(){
	paused=false;
	hero.speed=500;
	monster.speed=25;
	document.getElementById("background").play();
}






// Handle keyboard controls

// Pause
$( "body" ).on( "keydown", function( event ) {
	if(event.which=="13"&&paused==false){
		holdup() //pause
	}else if(event.which=="13"&&paused==true){
		keepgoin() //resume
	}else if(event.which=="32"){
		document.getElementById("scream").play(); //scream
	}else if(event.which=="27"&&hurd==false){
		hard(); //hard
	}else if(event.which=="27"&&hurd==true){
		easy(); //easy
	}else if(event.which<58 && event.which>47){
		changeVolume(event.which-48);
	}
});

// Main keys
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
	if ((38 in keysDown || 87 in keysDown)&&paused==false) { // Player holding up
		hero.y -= hero.speed * modifier;
		heroImage.src = "http://i.imgur.com/ld2k1Ba.png";
	}
	if ((40 in keysDown || 83 in keysDown)&&paused==false) { // Player holding down
		hero.y += hero.speed * modifier;
		heroImage.src = "http://i.imgur.com/azsvBrY.png";
	}
	if ((37 in keysDown || 65 in keysDown)&&paused==false) { // Player holding left
		hero.x -= hero.speed * modifier;
		heroImage.src = "http://i.imgur.com/aS3kDkT.png";
	}
	if ((39 in keysDown || 68 in keysDown)&&paused==false) { // Player holding right
		hero.x += hero.speed * modifier;
		heroImage.src = "http://i.imgur.com/RPZ43WI.png";
	}

	// Mobile
	/*function left(){
		hero.x -= 1; //used to be -= hero.speed*modifier
		heroImage.src = "http://i.imgur.com/aS3kDkT.png";
	}
	function right(){
		hero.x += 1;
		heroImage.src = "http://i.imgur.com/RPZ43WI.png";
	}
	function up(){
		hero.y -= 1;
		heroImage.src = "http://i.imgur.com/ld2k1Ba.png";
	}
	function down(){
		hero.y += 1;
		heroImage.src = "http://i.imgur.com/azsvBrY.png";
	}*/

	/*$(".touchBox").mouseover(function(){
		console.log("touched something");
	});*/
	
	/*$("#leftBox").mouseover(function(){
		console.log("left");
		left();
	});
	$("#rightBox").mouseover(function(){
		console.log("right");
		right();
	});
	$("#topBox").mouseover(function(){
		console.log("top");
		up();
	});
	$("#bottomBox").mouseover(function(){
		console.log("bottom");
		down();
	});*/

	// Are they touching?
	if (
		hero.x <= (monster.x + 110)
		&& monster.x <= (hero.x + 110)
		&& hero.y <= (monster.y + 110)
		&& monster.y <= (hero.y + 110)
	) {
		if(hurd==true){
			$("#monsterDeath").trigger('play');
			heroImage.src = "http://fc09.deviantart.net/fs71/f/2011/143/2/f/blood_splatter_transparency_by_sagacious-d3h1yw6.png";
			monsterImage.src=""
			hero.speed=0;
		}else{
			$("#monsterDeath").trigger('play');
			++monstersCaught;
			reset();
		}
	}


	// Monster moves away
	if(hurd==false){
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
	}

	if(hurd==true){
		if(monster.y<hero.y){
			monster.y+=monster.speed * modifier;
		}else{
			monster.y-=monster.speed * modifier;
		}
		if(monster.x<hero.x){
			monster.x+=monster.speed * modifier;
		}else{
			monster.x-=monster.speed * modifier;
		}
	}

	// Monster jiggle
	yRand=Math.random();
	xRand=Math.random();
	if(yRand>.5){
		monster.y-=monster.speed * modifier*jiggle;
	}else{
		monster.y+=monster.speed * modifier*jiggle;
	}
	if(xRand>.5){
		monster.x-=monster.speed * modifier*jiggle;
	}else{
		monster.x+=monster.speed * modifier*jiggle;
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


	// Have it make the canvas's opacity go to 0, then go back to 1 and continue
	var normal= document.querySelector("#top").innerHTML;
	//console.log(normal);
	if(monstersCaught==100){
		$('#background').prop("volume", 0);
		document.querySelector("#top").innerHTML='<img id="batman" src="http://new1.fjcdn.com/comments/4926493+_2cc448c00af78212dedc0ba31ea4def5.jpg" /><audio id="whale" autoplay src="http://soundbible.com/mp3/Quick%20Fart-SoundBible.com-655578646.mp3"></audio>';
		//changeVolume(10);

		//console.log("changed");
		/*setTimeout(function(){
			document.querySelector("#top").innerHTML=normal;
			console.log("changed back");
			monstersCaught++;
		}, 1000);*/
	}

	// FUCKING LOUD
	if(monstersCaught==101+randNum){
		$('#background').prop("volume", 1);
		changeVolume(10);
	}
};

// Timer
var time=0;
setInterval(function(){
	if(paused==false){
		time++;
	}
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






	// Add new shit
	/*myShit= new newShit(Math.random()*canvas.width,Math.random()*canvas.height);*/







	// Score
	ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
	ctx.font = "30px Arial";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Beasties caught: " + monstersCaught, 5, 5);
	ctx.fillText("Time: "+time+" seconds", 5, 30);
	ctx.fillText("Score per minute: "+ Math.floor(monstersCaught/(time/60)), 5, 55);
	// Controls
	ctx.font = "15px Arial";
	ctx.textAlign = "right";
	ctx.fillText("Controls:", canvas.width-5, 5);
	ctx.fillText("WASD/Arrows = Directions", canvas.width-5, 25);
	ctx.fillText("Enter = Pause", canvas.width-5, 45);
	ctx.fillText("Space = Scream", canvas.width-5, 65);
	ctx.fillText("Number Keys = Volume", canvas.width-5, 85);
	ctx.fillText("Escape = Change Difficulty", canvas.width-5, 105);
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
