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
playerImage.src = "http://www.jimmiedave.com/wp-content/uploads/2012/03/Black-Test-1.png";

// player0 image
var player0Ready = false;
var player0Image = new Image();
player0Image.onload = function () {
	player0Ready = true;
};
player0Image.src = "http://www.jimmiedave.com/wp-content/uploads/2012/03/Black-Test-1.png";

// Preset Variables
safeDown=Math.floor(Math.random()*2);
lost=false;
paused=false;
// Customizable Variables
playerSpeed=500;
playerDim=50;
timerInterval=1000;
safeHeight=200;
safeSpeed=100;
dotLColor="#00a";
dotRColor="#a00";
playerColor="#00a";
player0Color="#a00";
backgroundLColor="#aaf";
backgroundRColor="#faa";
safeColor="#afa"

// Functions
function lose(winner){
	pauseGame();
	lost=true;
	ctx.fillStyle = "rgba(0,0,0,.25)";
	ctx.font = "200px Helvetica";
	ctx.fillText(winner+" wins!",0,0);
}

function pauseGame(){
	paused=true
}
function resumeGame(){
	paused=false;
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

var safe={
	y:(canvas.height/2)-(safeHeight/2),
	height:safeHeight,
	speed:safeSpeed
};

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
		xL=Math.random()*canvas.width/2;
		yL=Math.random()*canvas.height;
		xR=Math.random()*canvas.width/2+canvas.width/2;
		yR=Math.random()*canvas.height;

		if(yL>=safe.y&&yL<=(safe.y+safeHeight)){
		}else{
			dotL.push(dot_L(xL,yL));
		}

		if(yR>=safe.y&&yR<=(safe.y+safeHeight)){
		}else{
			dotR.push(dot_R(xR,yR));
		}
	}
},timerInterval);

// Handle keyboard controls
// Single key events
$( "body" ).on( "keydown", function( event ) {
	if(event.which=="32"&&lost==true){
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

// Update game objects
var update = function (modifier) {

	// Safe zone movement
	if(safeDown==1){
		safe.y+=safe.speed*modifier;
	}else{
		safe.y-=safe.speed*modifier;
	}

	if(safe.y+safeHeight>=canvas.height){
		safeDown=0;
	}
	if(safe.y<=0){
		safeDown=1;
	}

	if(lost==false&&paused==false){
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

	// collision with dot
	for(var a in dotL){
		if (
			player.x <= (dotL[a].x + 9)
			&& dotL[a].x <= (player.x + player.width-1)
			&& player.y <= (dotL[a].y + 9)
			&& dotL[a].y <= (player.y + player.height-1)
			&&lost==false
		){
			lose("Player 2");
		}
	}

	for(var a in dotR){
		if (
			player0.x <= (dotR[a].x + 9)
			&& dotR[a].x <= (player0.x + player0.width-1)
			&& player0.y <= (dotR[a].y + 9)
			&& dotR[a].y <= (player0.y + player0.height-1)
			&&lost==false
		){
			lose("Player 1");
		};
	};

	// Collision with Safe
	if(player.y>=safe.y&&(player.y+playerDim)<=(safe.y+safe.height)){
	}else{
		lose("Player 2");
	};
	if(player0.y>=safe.y&&(player0.y+playerDim)<=(safe.y+safe.height)){
	}else{
		lose("Player 1");
	};

	};
}; //end of update()

// Draw everything
var render = function () {
	if(lost==false){
	/*if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}*/

	ctx.fillStyle=backgroundLColor;
	ctx.fillRect(0,0,canvas.width/2,canvas.height);

	ctx.fillStyle=backgroundRColor;
	ctx.fillRect(canvas.width/2,0,canvas.width/2,canvas.height);

	// Safe Zone
	ctx.fillStyle=safeColor;
	ctx.fillRect(0, safe.y, canvas.width, safeHeight);

	/*if (playerReady) {
		ctx.drawImage(playerImage, player.x, player.y);
	}*/
	ctx.fillStyle=playerColor;
	ctx.fillRect(player.x,player.y,playerDim,playerDim);

	
	/*if (player0Ready) {
		ctx.drawImage(player0Image, player0.x, player0.y);
	}*/
	ctx.fillStyle=player0Color;
	ctx.fillRect(player0.x,player0.y,playerDim,playerDim);

	//middle line
	ctx.fillStyle = "#000";
	ctx.fillRect((canvas.width/2)-1,0,2,canvas.height)

	// Score
	ctx.fillStyle = "#000";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	//ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);

	// Draw dots
	ctx.fillStyle=dotLColor;
	for(var a in dotL){
		ctx.fillRect(dotL[a].x, dotL[a].y, 10, 10);
	};
	ctx.fillStyle=dotRColor;
	for(var a in dotR){
		ctx.fillRect(dotR[a].x, dotR[a].y, 10, 10);
	};

	if(paused){
		ctx.fillStyle = "rgba(0,0,0,.25)";
		ctx.font = "200px Helvetica";
		ctx.fillText("Paused",0,0);
	}

	};
}; //end of render()

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

/* TODO:
	Options that localSave like similar dot patters, colors for dots, players, and background, or something else
	Timer for overall survival time
*/
