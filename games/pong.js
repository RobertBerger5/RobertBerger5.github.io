//window.onload=function(){
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    c.height = $(window).height();
    c.width = $(window).width();

    //custom variables
    var ballDim=10;//size of ball
    var playerHeight=c.height/5;
    var playerWidth=5;
    var FPS=60;//fps target, plugged into updateSpeed
    var playerSpeed=500;//speed of player in pixels per second (maybe?)
    var ballSpeed=1000;

    //preset variables
    var paused=false;
    var updateSpeed=1/(FPS/1000);
    var lost=false;
    var backgroundColor="#000";

//misc
    ctx.font = "25px Helvetica";
	ctx.textAlign = "center";
	ctx.textBaseline = "center";

	// Single Key Events
	$( "body" ).on( "keydown", function( event ) {
		if(event.which=="32"&&paused==false&&lost==false){
			holdUp(); //or paused=true;
		}else if(event.which=="32"&&paused==true&&lost==false){
			keepGoin(); //or paused=false;
		}else if(event.which=="32"&&lost==true){
			location.reload();
		}
	});


    //objects
    var player0={
    	x:c.width/10,
    	y:c.height/2-ballDim/2,
    	w:playerWidth,
    	h:playerHeight,
    	speed:playerSpeed,
    	points:0
    }
    var player1={
    	x:9*c.width/10,
    	y:c.height/2-ballDim/2,
    	w:playerWidth,
    	h:playerHeight,
    	speed:playerSpeed,
    	points:0
    }

	var ball={
		x:c.width/2,
		y:Math.random()*(c.height-ballDim),
		speedX:-ballSpeed,
		speedY:500,
		direction:-1
	}

	//keys down
	var keysDown = {};

	addEventListener("keydown", function (e) {
		keysDown[e.keyCode] = true;
	}, false);

	addEventListener("keyup", function (e) {
		delete keysDown[e.keyCode];
	}, false);

	//options
	function holdUp(){
		paused=true;
	}
	function keepGoin(){
		paused=false;
	}

	function spawnBall(){
		ball.direction=ball.direction*-1
		ball.x=c.width/2;
		ball.y=Math.random()*(c.height-ballDim);
		ball.speedX=ballSpeed*ball.direction;
		ball.speedY=ballSpeed*(Math.random()/2+.5);
	}
	spawnBall()

var update=function(modifier){
	if(paused==false){

	if ((87 in keysDown)&&paused==false) { // Player holding up
		player0.y -= player0.speed * modifier;
	}
	if ((83 in keysDown)&&paused==false) { // Player holding down
		player0.y += player0.speed * modifier;
	}

	if ((38 in keysDown)&&paused==false) { // Player holding up
		player1.y -= player1.speed * modifier;
	}
	if ((40 in keysDown)&&paused==false) { // Player holding down
		player1.y += player1.speed * modifier;
	}
	//TODO: player1 controls and way to set how many people are playing

	ball.x += ball.speedX*modifier;
	ball.y += ball.speedY*modifier;

	//TODO: ball touching
	//touch floor/cieling
	if(ball.y+ballDim>=c.height){
		ball.speedY=-ball.speedY;
	}
	if(ball.y<=0){
		ball.speedY=-ball.speedY;
	}

	//touch player
	if(
		(ball.y<player0.y+player0.h&&
		ball.y+ballDim>player0.y&&
		ball.x<=player0.x+player0.w&&
		ball.x+ballDim>=player0.x)
		||
		(ball.y<player1.y+player1.h&&
		ball.y+ballDim>player1.y&&
		ball.x<player1.x+player1.w&&
		ball.x+ballDim>player1.x)
	){
		ball.speedX=-ball.speedX;
	}

	//touchbehind player
	if(
		ball.x+ballDim<=0
	){
		player1.points++;
		spawnBall();
	}
	if(
		ball.x>=c.width
	){
		player0.points++;
		spawnBall();
	}

	};//end if(paused==false);
};//end update

var render = function () {
	if(paused==false){
	ctx.fillStyle=backgroundColor;
	ctx.fillRect(0,0,c.width,c.height);

	//draw player
	ctx.fillStyle="#fff";
	ctx.fillRect(player0.x,player0.y,player0.w,player0.h);
	ctx.fillRect(player1.x,player1.y,player1.w,player1.h);
	ctx.fillRect(ball.x,ball.y,ballDim,ballDim);

	//draw words
	ctx.fillText(player0.points+"  "+player1.points,c.width/2,25);


	};//end if(paused==false);
};//end render

setInterval(function(){
	update(updateSpeed/2000);
	render();
	//console.clear();
},updateSpeed);
