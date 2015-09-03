// Create the canvas
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
canvas.width = $(window).width();
canvas.height = $(window).height();

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "http://temp.indicom-electric.com/wp-content/uploads/2013/05/background.jpg";

// player image
var playerReady = false;
var playerImage = new Image();
playerImage.onload = function () {
	playerReady = true;
};
playerImage.src = "http://i.imgur.com/1gH2sZ9.png?1";

// player0 image
var player0Ready = false;
var player0Image = new Image();
player0Image.onload = function () {
	player0Ready = true;
};
player0Image.src = "http://i.imgur.com/Rr5kPpb.png?1";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "http://vignette1.wikia.nocookie.net/kairosoft/images/8/8f/Drazilla_(Beastie_Bay).png/revision/latest?cb=20140215160639";

// Variables
playerSpeed=500;
lost=false;
paused=false;
playerDim=256;
timerInterval=1000;

// Functions
function lose(){
	lost=true;
}

function pauseGame(){
	paused=true
	playerSpeed=0;
}
function resumeGame(){
	paused=false;
	playerSpeed=500;
}

// Game objects
var player = {
	speed: playerSpeed,
	x:canvas.width/4-playerDim/2,
	y:canvas.height/2-playerDim/2,
	height:playerDim,
	width:playerDim
};
var player0 = {
	speed: playerSpeed,
	x:canvas.width/4*3-playerDim/2,
	y:canvas.height/2-playerDim/2,
	height:playerDim,
	width:playerDim
};
var monster = {};
var monstersCaught = 0;

// Other
// .push() magic THIS IS ALL I'VE DONE ON THE DOTS SO FAR
var dotL=[];
var dot_L=function(x,y){
	return{
		x:x,
		y:y,
	}
}

var dotR=[];
var dot_R=function(x,y){
	return{
		x:x,
		y:y,
	}
}

// Timer
setInterval(function(){
	if(paused==false){
		// Dot Maker
		var xCo=Math.random()*canvas.width/2
		var yCo=Math.random()*canvas.height
		dotL.push(dot_L(
		xCo,
		yCo
		));
		dotR.push(dot_R(
		xCo+canvas.width/2,
		yCo
		));
	}
},timerInterval);

// Handle keyboard controls
// Single key events
$( "body" ).on( "keydown", function( event ) {
	if(event.which=="32"&&paused==false&&lost==true){
		location.reload();
	}else if(event.which=="32"&&paused==false&&lost==false){
		pauseGame();
		//location.reload();
		console.log("paused");
	}else if(event.which=="32"&&paused==true&&lost==false){
		resumeGame();
		console.log("resumed");
	}
})

// Ongoing key events
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
	if (87 in keysDown) { // Player holding up
		player.y -= player.speed * modifier;
	}
	if (83 in keysDown) { // Player holding down
		player.y += player.speed * modifier;
	}
	if (65 in keysDown) { // Player holding left
		player.x -= player.speed * modifier;
	}
	if (68 in keysDown) { // Player holding right
		player.x += player.speed * modifier;
	}
	
	// player0
	if (73 in keysDown) { // Player holding up
		player0.y -= player0.speed * modifier;
	}
	if (75 in keysDown) { // Player holding down
		player0.y += player0.speed * modifier;
	}
	if (74 in keysDown) { // Player holding left
		player0.x -= player0.speed * modifier;
	}
	if (76 in keysDown) { // Player holding right
		player0.x += player0.speed * modifier;
	}

	// Are they touching?
	if (
		player.x <= (monster.x + 32)
		&& monster.x <= (player.x + 32)
		&& player.y <= (monster.y + 32)
		&& monster.y <= (player.y + 32)
	) {
		++monstersCaught;
		reset();
	}

	// Walls
	if (player.x < 0) {
		player.x+=player.speed*modifier;
	}else if(player.x>canvas.width/2-(player.width)){
		player.x-=player.speed*modifier;
	}else{}

	if (player.y < 0) {
		player.y+=player.speed*modifier;
	}else if(player.y>canvas.height-(player.height)){
		player.y-=player.speed*modifier;
	}else{}

	if (player0.x < canvas.width/2) {
		player0.x+=player0.speed*modifier;
	}else if(player0.x>canvas.width-(player0.width)){
		player0.x-=player0.speed*modifier;
	}else{}

	if (player0.y < 0) {
		player0.y+=player0.speed*modifier;
	}else if(player0.y>canvas.height-(player0.height)){
		player0.y-=player0.speed*modifier;
	}else{}
};



// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	ctx.fillStyle="#fff";
	ctx.fillRect(0,0,canvas.width,canvas.height)

	if (playerReady) {
		ctx.drawImage(playerImage, player.x, player.y);
	}
	
	if (player0Ready) {
		ctx.drawImage(player0Image, player0.x, player0.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	ctx.fillStyle = "#000";
	ctx.fillRect((canvas.width/2)-5,0,10,canvas.height)

	// Score
	ctx.fillStyle = "#fff";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	//ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);

	// Draw dots
	ctx.fillStyle="#0f0";
	for(var a in dotL){
		ctx.fillRect(dotL[a].x, dotL[a].y, 10, 10);
	};
	ctx.fillStyle="#0ff";
	for(var a in dotR){
		ctx.fillRect(dotR[a].x, dotR[a].y, 10, 10);
	};
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible

/* TODO: MAKE THE ACTUAL FUCKING GAME

Plan:
	Screen split into left and right halves
	Each half does something
	The half that does it better wins
	woo hoo

*/
