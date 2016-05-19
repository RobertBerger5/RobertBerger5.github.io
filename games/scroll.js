var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
c.height = $(window).height();
c.width = $(window).width();

//variables
var playerDim=50; //player size, useless because it can only be as wide as the tiles
var updateSpeed=10; //main setInterval interval that calls update() and render()
var paused=false; //boolean for paused
var lost=false; //boolean for lost
var xOffSet=0; //works with the velocity, helps to see when generateScene() is called and when the player's gone another canvas length
var playerX=c.width/5 //initial player x value
var tilesOnScene=10; //number of tiles on the screen, most of the game was programmed with 10 in mind
var tileDim=c.width/tilesOnScene; //size of each tile
var canvasLoops=0; //times the canvas has looped, used for generateScene()
var acceleration=-.5; //default, had to be typed every time he started falling
var enemyHeight=tileDim/2; //tank height
var enemyWidth=tileDim; //tank width
var animateFrames=0; //for tank sprites
var coinSize=tileDim*3/tilesOnScene; //coin size, will get fucked up for different canvas sizes
var loveProbability=.1;

var pImg=new Image(); //player image
pImg.src=""; //empty?
//pImg.src="https://cdn.tutsplus.com/mobile/uploads/legacy/Corona-SDK_Side-Scroller/3/monsterSpriteSheet.png";
var bgImg=new Image(); //background image
bgImg.src="https://s-media-cache-ak0.pinimg.com/736x/40/a8/c9/40a8c9f722458cb43889883e736fb9e9.jpg";
//bgImg.src="http://i.imgur.com/LTcEeZp.jpg";
var tImg0=new Image(); //stupid idea
tImg0.src="http://i.imgur.com/7vhiWGd.png";
var tImg1=new Image(); //stupid idea
tImg1.src="http://i.imgur.com/eyvAk8Q.png";
var bulletImg=new Image();
bulletImg.src="http://vignette3.wikia.nocookie.net/commando2/images/8/84/Glenos-G_160_bullet.png/revision/latest?cb=20120731090012";
var loveImg=new Image();
loveImg.src="http://orig08.deviantart.net/26e4/f/2014/281/5/9/pixel_heart_by_emeraldplaysmcraft-d81zjcr.png";
var coinImg=new Image();
coinImg.src="http://piq.codeus.net/static/media/userpics/piq_135044_400x400.png";
var buildingImg=new Image();
buildingImg.src="http://worldartsme.com/images/sky-scarper-clipart-1.jpg";
var rubbleImg=new Image();
rubbleImg.src="http://orig03.deviantart.net/46b9/f/2013/210/d/9/rubble_7_by_cgartiste-d6fq7hp.png";

//functions
function onGround(){
	if(
		(player.y+player.height >= ground[player.tile-1].y)||
		(player.y+player.height >= ground[player.tile].y)
	){
		return true;
	}else{
		player.yA=acceleration;
		return false;
	}
}
function inGround(){
	if(
		(player.y+player.height > ground[player.tile-1].y)||
		(player.y+player.height > ground[player.tile].y)
	){
		moveToGround();
		return true;
	}else{
		return false;
	}
}

function moveToGround(){
	if(ground[player.tile-1].y<ground[player.tile].y){
		player.y=ground[player.tile-1].y-player.height;
	}else{
		if( //if the player is way in the ground, have him lose health based on how far in the ground he is
			player.y+(player.height*.95)>=ground[player.tile].y
			//&& player.tile>=5
		)
		{
			player.health -= Math.trunc( (player.height+player.y - ground[player.tile].y)/10 );
			checkHealth();
		}

		player.y=ground[player.tile].y-player.height;		
	}
	player.yV=0;
	//player.yA=0;
}

function generateScene(){
	for(var i=0;i<tilesOnScene;i++){
		groundHeight=Math.random()*player.height*2+c.height-player.height*2 - 10; //to make enemies spawn at the ground height
		groundType=Math.floor(Math.random()*4);//to be able to label the ground, the more I multiply it by, the less actual obsticles get generated
		ground.push(tile(
			c.width+canvasLoops*c.width+i*tileDim, //x
			groundHeight, //y
			groundType//type
		)); //y part needs to be on the ground
		switch(groundType){ //so it spawns random shit, can only spawn one of each on the thingie      MAKE SURE TO PUSH NOTHING IF NOTHING IS PUSHED
			case 0: //enemy
				things.push(enemy(
					c.width+canvasLoops*c.width+i*tileDim+(tileDim-enemyWidth)/2, //x
					groundHeight-enemyHeight //y
				))
			break;
			case 1: //lava
				ground[tilesOnScene*canvasLoops+tilesOnScene+i].y=c.height+player.height*100;
				//commented out the part where it subtracts 50 from player.health, leaving damage to the moveToGround() function
				things.push(nothing(
					//nuthin
				))
			break;
			case 2: //coin
				things.push(coin(
					c.width+canvasLoops*c.width+i*tileDim+(tileDim-coinSize)/2,//x
					(Math.random()*(c.height-groundHeight-coinSize-10))//y
				))
			break;
			case 3:
				things.push(building(
					c.width+canvasLoops*c.width+i*tileDim, //x
					groundHeight //y
				))
			break; //fucking retard
			default:
			things.push(nothing(
				//nuthin?
			))
		}

		if(canvasLoops>=2){
			//ground.splice(0,1);
		}
		//ground.splice(0,1)
	}
	//console.log("scene generated");

	//TODO: splice ground[] and things[] for previous shit? would that fuck anything up?
	if(canvasLoops>=1){
		//spliceShit(); TODO TODO TODO: FUCKING THIS SHIT
	}
}

function spliceShit(){
	ground.splice(0,tilesOnScene)
	things.splice(0,tilesOnScene)
}

function checkKeys(){
	if(KEY_CODES.W in keysDown){
		/*ctx.translate(0,-1);
		player.y++;*/
		// jump() ?
		if(onGround()){
			player.onGround=false;
			player.yA=acceleration;
			player.yV=-c.height*tilesOnScene/350; //jump, //TODO: fix for different screen sizes, fraction of the canvas height? -15
			//player.phase=6;
			player.y--; //has to go up by 1
		}
	}
	if(KEY_CODES.S in keysDown){
		/*ctx.translate(0,1);
		player.y--;*/
		// crouch() ?
	}
	if(KEY_CODES.A in keysDown){
		player.veloc++;
	}
	if(KEY_CODES.D in keysDown){
		player.veloc--;
	}
}

function fillTile(a){ //default rendering of ground, lava tiles don't call it, though
	ctx.fillStyle="#555";
	ctx.fillRect(ground[a].x,ground[a].y,tileDim,500); //made taller than tileDim for tall screens
	ctx.fillStyle="#000";
	ctx.fillText(ground[a].type+", "+a,ground[a].x+10,ground[a].y+30);
};

function checkHealth(){
	if(player.health<=0){
		if(player.lives>0){
			player.lives--;
			player.health=100;
		}else{
			paused=true;
		}
	}
}

function newTile(){
	player.tile++;
	player.veloc-=.25/tilesOnScene;
	//console.log("increase tile");
	//moveToGround();
	if(onGround){
		player.onGround=false;
		player.yA=acceleration;
		player.y--;
		//inGround();
	}
	//if(player.y>=c.height){
		//paused=true;
		//player.health-=50;
		//checkHealth();
	//}

	if(things[player.tile-1].type=="building"){
		things[player.tile-1].destroyed=true;
		//console.log("destroyed");
	}

	/*for(var a in things){
		if(
			things[a].type=="building" &&
			player.x<things[a-1].x &&
			player.x+player.width>things[a-1].x &&
			player.y+player.height>things[a-1].y-tileDim &&
			player.y-player.height<things[a-1].y+tileDim
		){
			things[a].destroyed=true;
			console.log("destroyed");
		}
	}*/
}

//objects
var player={
	width:tileDim,
	height:tileDim,
	x:playerX,
	y:c.height/2,
	veloc:-2, //negative velocities are faster
	yA:acceleration,
	yV:0,
	phase:0,
	onGround:false,
	tile:0, //TODO: this could also be the reason splicing doesn't work
	health:100,
	score:0,
	lives:1
}


//misc

var keysDown = {};

var ground=[];
var tile=function(x,y,type){
	return{
		x:x,
		y:y,
		type:type
	}
}

var things=[];
var enemy=function(x,y){
	return{
		x:x,
		y:y,
		type:"enemy"
	}
}

ground[-1]={ //complains at beginning without this because it calls ground[player.tile-1] when player.tile is 0 TODO:is this the reason splicing doesn't work?
	x:0,
	y:c.height-10
}

things[-1]={
	x:0,
	y:0,
	shit:"fuck"
}

var bullets=[];
var loves=[];
function shoot(x,y){
	if(Math.random()>loveProbability){
		bullets.push(bullet(x,y/*,bullet*/)); //why was that there and why did it work with it there
	}else{
		loves.push(love(x,y))
	}
};

var bullet=function(x,y){
	return{
		x:x,
		y:y,
		time:0
	}
}

var love=function(x,y){
	return{
		x:x,
		y:y,
		veloc:-25 //TODO: make relative to canvas size
	}
}

var coin=function(x,y){
	return{
		x:x,
		y:y,
		type:"coin",
		gone:false
	}
}

var building=function(x,y){
	return{
		x:x,
		y:y,
		type:"building",
		destroyed:false
	}
}

var nothing=function(){
	return{
		type:"nothing",
		fucks:0
	}
}

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Single Key Events
$( "body" ).on( "keydown", function( event ) {
	if(event.which=="32"&&paused==false&&lost==false){
		paused=true;
		console.log("paused");
	}else if(event.which=="32"&&paused==true&&lost==false){
		paused=false;
		console.log("unpaused");
	}else if(event.which=="32"&&lost==true){
		location.reload();
	}
});

var update=function(){
	//inGround();

	if(paused==false){
		if(xOffSet>=c.width){ //chick if the canvas has looped, generate scenery
			canvasLoops++;
			generateScene();
			xOffSet=0;
			//player.veloc-=.25;
		}

		//player.x+=player.veloc;
		ctx.translate(player.veloc,0);
		player.x-=player.veloc;
		xOffSet-=player.veloc;

		if(!player.onGround){ //if player isn't on the ground
		//if(player.yA != 0){ //if player isn't on the ground
			if(onGround()){  //constantly checks if he's still falling, falls slightly into floor for some reason
				moveToGround();
				player.onGround=true;
				player.yV=0;
				player.yA=0;
			}else{
				//console.log("falling");
			}
		}else{
			player.yV=0;
			player.yA=0;
		}

		//increase player tile if they're over it
		if(player.x>player.tile*tileDim){
			newTile();
		}

		checkKeys();

		player.yV-=player.yA; //acceleration changes velocity
		player.y+=player.yV; //velocity changes position

		for(var a in bullets){
			bullets[a].x--;
			bullets[a].time++; //depends on updateSpeed this way, probably bad
			if(bullets[a].time>500){
				bullets.splice(a,1);
			}else if(
				player.x+player.width*.75>bullets[a].x 	&& //lil bitty hitbox
				player.x+player.width*.25<bullets[a].x 	&&
				player.y+player.height*.85>bullets[a].y &&
				player.y+player.height*.15<bullets[a].y
			){
				//paused=true;
				player.health-=10;
				bullets.splice(a,1);
				checkHealth();
			}
		}

		for(var a in loves){
			loves[a].y+=loves[a].veloc;
			loves[a].x-=10; //make it shoot forward in an arc
			loves[a].veloc+=1;

			if(
				player.x+player.width>loves[a].x 	&&
				player.x<loves[a].x 				&&
				player.y+player.height>loves[a].y 	&&
				player.y<loves[a].y
			){
				loves.splice(a,1);
				player.lives++;
			}

		}

		for(var a in things){
		  if(things[a].type=="coin"){
			if(
				things[a].gone==false &&
				player.x+player.width>things[a].x &&
				player.x<things[a].x+coinSize &&
				player.y+player.height>things[a].y &&
				player.y<things[a].y+coinSize
			){
				things[a].gone=true;
				//things.splice(a,1);
				player.score++;
			}
		  }
		}

	}
}

ctx.font="20px Arial";//for the debugging labels on the ground
var render=function(){
	if(paused==false){
		ctx.drawImage(bgImg, player.x-playerX, 0, c.width, c.height);//draw background

		ctx.fillStyle="#f00";
		for(var i=0;i<100;i++){
			ctx.fillRect(c.width*i-1,0,2,c.height); //landmarks, only go up to 100, for test purposes only
		}

		/*ctx.globalAlpha=.5;
		ctx.fillStyle="#000";
		ctx.fillRect(player.x,player.y,player.width,player.height);
		ctx.fillStyle="#fff";
		//hitbox for bullets, y isn't the actual hitbox anymore, though
		ctx.fillRect(player.x+player.width*.25,player.y+player.height*.25,player.width*.5,player.height*.5);
		ctx.globalAlpha=1;*/
		ctx.drawImage(pImg, player.phase*pImg.width/7, 0, pImg.width/7, pImg.height, player.x, player.y, player.width, player.height);//draw player
		//ctx.fillStyle="#000";
		//ctx.fillText(player.tile+", "+player.health+", "+player.score,player.x+10,player.y-10);

		for(var a in ground){
			switch(ground[a].type){
				case 0: //enemy
					fillTile(a);
				break;
				case 1: //lava
					ctx.fillStyle="#f00";
					ctx.fillRect(ground[a].x,c.height-10,tileDim,10);
				break;
				case 2:
					fillTile(a);
				break;
				default:
					fillTile(a);
			}
		}

		for(var a in things){
		  if(things[a].type=="enemy"){
			if(animateFrames%2==0){
				ctx.drawImage(tImg0,things[a].x+enemyWidth,things[a].y,-enemyWidth,enemyHeight);
			}else{
				ctx.drawImage(tImg1,things[a].x+enemyWidth,things[a].y,-enemyWidth,enemyHeight);
			}
		  }else if(things[a].type=="coin" &&things[a].gone==false){
			ctx.drawImage(coinImg,things[a].x,things[a].y,coinSize,coinSize);
		  }else if(things[a].type=="building"){
		  	if(!things[a].destroyed){
		  		//ctx.fillStyle="#0f0"; //not destroyed image
		  		//ctx.fillRect(things[a].x,things[a].y-tileDim,tileDim,tileDim);
		  		ctx.drawImage(buildingImg,things[a].x,things[a].y-tileDim*2,tileDim,tileDim*2)
		  	}else{
		  		//ctx.fillStyle="#f00"; //destroyed image
		  		//ctx.fillRect(things[a].x,things[a].y-tileDim,tileDim,tileDim);
		  		ctx.drawImage(rubbleImg,things[a].x,things[a].y-tileDim*9/10,tileDim,tileDim)
		  	}
		  }
		  ctx.fillText(a,things[a].x,things[a].y);
		}

		for(var a in bullets){
			//ctx.fillRect(bullets[a].x,bullets[a].y,10,10);
			ctx.drawImage(bulletImg,bullets[a].x,bullets[a].y,250/tilesOnScene,500/tilesOnScene);
		}
		for(var a in loves){
			ctx.drawImage(loveImg,loves[a].x,loves[a].y,500/tilesOnScene,500/tilesOnScene);
		}

		ctx.fillStyle="#fff";
		ctx.fillRect(player.x-playerX,0,150,100);
		ctx.fillStyle="#000";
		ctx.fillText("Score: "+player.score,player.x-playerX,25);
		ctx.fillText("Lives: "+player.lives,player.x-playerX,50);
		ctx.fillText("Health: "+player.health,player.x-playerX,75);
	}
}

for(var i=0;i<tilesOnScene;i++){ //special generateScene for the beginning
	//groundHeight=Math.random()*player.height*2+c.height-player.height*2 - 10; //to make enemies spawn at the ground height
	groundHeight=c.height-tileDim;
	groundType=Math.floor(Math.random()*10);//to be able to label the ground, the more I multiply it by, the less actual obsticles get generated
	ground.push(tile(
		canvasLoops*c.width+i*tileDim, //x
		groundHeight, //y
		//groundType//type
		"O+<"
	)); //y part needs to be on the ground

	/*things.push(nothing(
		//nuthin?
	))*/

	things.push(building(
		i*tileDim, //x
		groundHeight //y
	))
}
generateScene();

//ground.splice(-1,1);





setInterval(function(){ //main function
	render()
	update();
	//render();
	//console.clear();
},updateSpeed);

setTimeout(function(){
	player.health=100; //player loses health at the beginnig, too lazy to find out why, oh well
},10);

for(var i=0;i<250;i++){ //flashes
	setTimeout(function(){
		ctx.fillStyle="#fff";
		ctx.fillRect(player.x-playerX, 0, c.width, c.height);
	},(i*5+750))
}
setTimeout(function(){
	bgImg.src="http://i.imgur.com/LTcEeZp.jpg"//change things to be super fucked up, background, player, buildings colors, all that
	pImg.src="https://cdn.tutsplus.com/mobile/uploads/legacy/Corona-SDK_Side-Scroller/3/monsterSpriteSheet.png";
},1000)

setInterval(function(){ //sprite shit
	animateFrames++;
	if(player.phase==6){
		if(onGround()){
			player.phase=0;
		}
	}else if(player.phase==5){
		player.phase=0;
	}else{
		player.phase++;
	}
},100);

setInterval(function(){
	for(var a in things){
	 if(things[a].type=="enemy"){
		shoot(things[a].x,things[a].y);
	  }
	}
},2500);

//ground.splice(-1,1); //necessary, works?

/*TODO: actual game ideas:
erase shit after it's done? otherwise it gets laggy
something like my idea for the other game, second player does job of helping/attacking the first
(previous idea has two completely different play styles at once)
try to make my own sprites?
localSave options again, less shitty this time?
*/
