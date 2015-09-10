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
timer=0;

// Customizable Variables
if(localStorage.getItem("playerSpeed")==null){
	playerSpeed=500;
	playerDim=50;
	timerInterval=1000;
	safeHeight=200;
	safeSpeed=100;
	dotLColor="#00f";
	dotRColor="#f00";
	playerColor="#00a";
	player0Color="#a00";
	backgroundLColor="#aaf";
	backgroundRColor="#faa";
	safeColor="#afa";

	localStorage.setItem("playerSpeed",playerSpeed);
	localStorage.setItem("playerDim",playerDim);
	localStorage.setItem("timerInterval",timerInterval);
	localStorage.setItem("safeHeight",safeHeight);
	localStorage.setItem("safeSpeed",safeSpeed);
	localStorage.setItem("dotLColor",dotLColor);
	localStorage.setItem("dotRColor",dotRColor);
	localStorage.setItem("playerColor",playerColor);
	localStorage.setItem("player0Color",player0Color);
	localStorage.setItem("backgroundLColor",backgroundLColor);
	localStorage.setItem("backgroundRColor",backgroundRColor);
	localStorage.setItem("safeColor",safeColor);
}else{
	playerSpeed=Number(localStorage.getItem("playerSpeed"));
	playerDim=Number(localStorage.getItem("playerDim"));
	timerInterval=Number(localStorage.getItem("timerInterval"));
	safeHeight=Number(localStorage.getItem("safeHeight"));
	safeSpeed=Number(localStorage.getItem("safeSpeed"));
	dotLColor=localStorage.getItem("dotLColor");
	dotRColor=localStorage.getItem("dotRColor");
	playerColor=localStorage.getItem("playerColor");
	player0Color=localStorage.getItem("player0Color");
	backgroundLColor=localStorage.getItem("backgroundLColor");
	backgroundRColor=localStorage.getItem("backgroundRColor");
	safeColor=localStorage.getItem("safeColor");

	document.getElementById('playerSpeedS').value=playerSpeed;
	document.getElementById('playerDimS').value=playerDim;
	document.getElementById('timerIntervalS').value=timerInterval;
	document.getElementById('safeHeightS').value=safeHeight;
	document.getElementById('safeSpeedS').value=safeSpeed;
	document.getElementById('dotLColorS').value=dotLColor;
	document.getElementById('dotRColorS').value=dotRColor;
	document.getElementById('playerColorS').value=playerColor;
	document.getElementById('player0ColorS').value=player0Color;
	document.getElementById('backgroundLColorS').value=backgroundLColor;
	document.getElementById('backgroundRColorS').value=backgroundRColor;
	document.getElementById('safeSpeedS').value=safeSpeed;

	/*var divOp=["playerSpeedS","playerDimS","timerIntervalS","safeHeightS","safeSpeedS","dotLColorS","dotRColorS","playerColorS","player0ColorS","backgroundLColorS","backgroundRColorS","safeColorS"]
	for(var i=0;i<divOp.length;i++){
		document
	}*/
}

// Functions

// Change Options Function
function changeSetting(settingS,setting,settingN){
	setting=settingS.value;
	localStorage.setItem(settingN,setting);
	console.log(settingN+" changed to "+setting);
};

function lose(winner){
	//pauseGame();
	lost=true;
	ctx.fillStyle = "rgba(0,0,0,.25)";
	ctx.font = "150px Helvetica";
	ctx.fillText(winner+" has won!",0,canvas.height/2);
	console.log(winner+" has won!");
};

function pauseGame(){
	paused=true
	console.log("Paused");
	document.getElementById("options").style.opacity=".5";
};
function resumeGame(){
	paused=false;
	console.log("Resumed");
	document.getElementById("options").style.opacity="0";
};

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

// Dot Spawn Timer
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

// Timer
setInterval(function(){
	if(paused==0&&lost==0){
		timer++;
	}
},10);

// Handle keyboard controls
// Single key events
$( "body" ).on( "keydown", function( event ) {
	if(event.which=="32"&&lost==true){
		location.reload();
	}else if(event.which=="32"&&paused==false&&lost==false){
		pauseGame();
		//location.reload();
	}else if(event.which=="32"&&paused==true&&lost==false){
		resumeGame();
	}else if(event.which=="27"&&paused==true&&lost==false){
		localStorage.clear();
		localStorage.setItem("recentGame","teamwork");
		console.log("Settings Cleared");
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

	if(lost==false&&paused==false){

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

	// Key movements
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

	// Draw dots
	ctx.fillStyle=dotLColor;
	for(var a in dotL){
		ctx.fillRect(dotL[a].x, dotL[a].y, 10, 10);
	};
	ctx.fillStyle=dotRColor;
	for(var a in dotR){
		ctx.fillRect(dotR[a].x, dotR[a].y, 10, 10);
	};

	//middle line
	ctx.fillStyle = "#000";
	ctx.fillRect((canvas.width/2)-1,0,2,canvas.height)

	// Timer
	ctx.font = "50px Helvetica";
	ctx.fillText((timer/100), canvas.width/2-40, 50);

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
setInterval(main, 1); //Execute as fast as possible

/* TODO:
	Options that localSave like similar dot patters, colors for dots, players, and background, or something else
		on pause make that div come up, on unpause change the values and localSave them
	Timer for overall survival time
*/
