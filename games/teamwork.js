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

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "http://i.imgur.com/1gH2sZ9.png?1";

// Hero0 image
var hero0Ready = false;
var hero0Image = new Image();
hero0Image.onload = function () {
	hero0Ready = true;
};
hero0Image.src = "http://i.imgur.com/Rr5kPpb.png?1";

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
var hero = {
	speed: playerSpeed,
	x:canvas.width/4-128,
	y:canvas.height/2-128
};
var hero0 = {
	speed: playerSpeed,
	x:canvas.width/4*3-128,
	y:canvas.height/2-128
};
var monster = {};
var monstersCaught = 0;

// Handle keyboard controls
// Single key events
$( "body" ).on( "keydown", function( event ) {
	if(event.which=="32"&&paused==false&&lost==true){
		location.reload();
	}else if(event.which=="32"&&paused==false&&lost==false){
		pauseGame("32");
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
		hero.y -= hero.speed * modifier;
	}
	if (83 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (65 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (68 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}
	
	// Hero0
	if (73 in keysDown) { // Player holding up
		hero0.y -= hero0.speed * modifier;
	}
	if (75 in keysDown) { // Player holding down
		hero0.y += hero0.speed * modifier;
	}
	if (74 in keysDown) { // Player holding left
		hero0.x -= hero0.speed * modifier;
	}
	if (76 in keysDown) { // Player holding right
		hero0.x += hero0.speed * modifier;
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

	ctx.fillRect(0,0,canvas.width,canvas.height)

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}
	
	if (hero0Ready) {
		ctx.drawImage(hero0Image, hero0.x, hero0.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	//ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
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

IDEAS:
jedi squirrel battle
maze game where they can't touch each other?
duel with sword on one side of square and shield on other- corners, two corners attack, two corners defend
pong or 1v1 tennis
*/
