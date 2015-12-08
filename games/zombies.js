//window.onload=function(){
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    c.height = $(window).height();
    c.width = $(window).width();

    $("#options").load("http://robertberger5.github.io/games/zombieOptions.txt"); //load text from the options into that div
    document.body.style.cursor = 'none';

    //misc
    ctx.font = "10px Helvetica";
	ctx.textAlign = "center";
	ctx.textBaseline = "center";

	// Single Key Events
	$( "body" ).on( "keydown", function( event ) {
		if(event.which=="32"&&paused==false&&lost==false){
			options();
		}else if(event.which=="32"&&paused==true&&lost==false){
			noOptions();
		}else if(event.which=="32"&&lost==true){
			location.reload();
		}
	});

    //custom variables
    var spawnRate=1000;//how fast zombies spawn
    var zombDim=50;//size of player and zombies
    var FPS=60;//fps target, plugged into updateSpeed
    var playerSpeed=500;//speed of player in pixels per second (maybe?)
    var maxZombs=10;//highest number of zombies
    	maxZombs--;//needed to be subtracted because arrays start at 0
    var speedRatio=.25;//playerSpeed to zombieSpeed
    //var healthLose=

    //preset variables
    var mouseX;
    var mouseY;
    var lastMouseX;
    var lastMouseY;
    var mouseDown=false;
    var paused=false;
    var currentZombs=0;
    var updateSpeed=1/(FPS/1000);
    var lost=false;
    var backgroundColor="#fff";
    var mouseSlope=null;

    //objects
    var player0={
    	x:c.width/2,
    	y:c.height/2,
    	speed:playerSpeed,
    	health:100,
    	touchZomb:false
    }
	var zombs=[];
	var touchPlayer=[];
	var zombie=function(x,y){
		return{
			x:x,
			y:y,
			health:100,
			distance:null,
			touchPlayer:false,
			losingHealth:false
		}
	}

	setInterval(function(){
		if(paused==false&&zombs.length<=maxZombs){
			zombs.push(zombie(Math.random()*(c.width-2*zombDim)+zombDim,Math.random()*(c.height-2*zombDim)+zombDim));
			//TODO: spawn outside window?
		};
	},spawnRate);
/*zombs.push(zombie(Math.random()*c.width,Math.random()*c.height));
zombs.push(zombie(Math.random()*c.width,Math.random()*c.height));*/

	//player loses health
	setInterval(function(){
		if(touchPlayer.indexOf(1)!=-1&&paused==false){
			player0.health--;
		};
		if(player0.health<0){
			paused=true;
			lost=true;
		};
	},10);
	//zombies lose health
	/*setInterval(function(){
		for(var a in zombs){
			if(zombs[a].losingHealth){
				zombs[a].health=zombs[a].health-1;
			};
		};
	},10);*/

	//keys down
	var keysDown = {};

	addEventListener("keydown", function (e) {
		keysDown[e.keyCode] = true;
	}, false);

	addEventListener("keyup", function (e) {
		delete keysDown[e.keyCode];
	}, false);

	//mouse coordanites
	function getMousePos(canvas,evt){
		var rect=canvas.getBoundingClientRect();
		return{
			x:evt.clientX-rect.left,
			y:evt.clientY-rect.top
		};
	}
	canvas.addEventListener('mousemove',function(evt){
		var mousePos=getMousePos(canvas,evt);
		mouseX=mousePos.x;
		mouseY=mousePos.y;
	})

	canvas.addEventListener('mouseup',function(){
		mouseDown=false;
	});
	canvas.addEventListener('mousedown',function(){
		mouseDown=true;
	});
		canvas.addEventListener('click',function(){
		shoot();
	});
	//options
	function options(){
		paused=true;
		document.getElementById("options").style.zIndex="5";
		document.body.style.cursor = 'auto';
	}
	function noOptions(){
		paused=false;
		document.getElementById("options").style.zIndex="-1";
		document.body.style.cursor = 'auto';
	}

	//shoot
	function shoot(){
		for(var a in zombs){
		//mouse aimed at zombie
		if(
			(((player0.y+zombDim/2)-(zombs[a].y+zombDim/2))/((zombs[a].x+zombDim/2)-(player0.x+zombDim/2)))<=(mouseSlope+zombDim/zombs[a].distance) &&
			(((player0.y+zombDim/2)-(zombs[a].y+zombDim/2))/((zombs[a].x+zombDim/2)-(player0.x+zombDim/2)))>=(mouseSlope-zombDim/zombs[a].distance) &&
			((//RESTRICT THE DOMAIN
				zombs[a].x>player0.x&&
				mouseX>player0.x
			)||(
				zombs[a].x<player0.x&&
				mouseX<player0.x
			))//RESTRICT THE DOMAIN
			){
			//console.log("aimed at zombie "+a);
			//backgroundColor="#faa";
			//zombs[a].losingHealth=true;
			zombs[a].health=zombs[a].health-10;

		}else{
			//backgroundColor="#aaf";
			//zombs[a].losingHealth=false;
		}
	}
	}

var update=function(modifier){
	if(paused==false){
//mouse
	mouseSlope=(mouseY-(player0.y+zombDim/2))/((player0.x+zombDim/2)-mouseX);//mixed up because canvas origin makes it in the 3rd quadrant of graph

	//TODO: shoot when mouse is clicked, shoot()?, if zombies line up with shot bring down their health, different guns like shotguns pistol or uzi?
	//second player could have sniper scope overlooking, provide cover for first player
	//TODO: FUCKING WALLS, HOW DO THEY WORK? or a window that scrolls with the player, have zombies spawn outside it
	//...could also have zombies spawn outside the stationary window I have now
	//http://365psd.com/images/premium/thumbs/221/cartoon-zombie-face-1103027.jpg FACES FOR OBJECTS 
	////ctx.rotate(20*Math.PI/180); useful?
//player

	if ((87 in keysDown)&&paused==false) { // Player holding up
		player0.y -= player0.speed * modifier;
	}
	if ((83 in keysDown)&&paused==false) { // Player holding down
		player0.y += player0.speed * modifier;
	}
	if ((65 in keysDown)&&paused==false) { // Player holding left
		player0.x -= player0.speed * modifier;
	}
	if ((68 in keysDown)&&paused==false) { // Player holding right
		player0.x += player0.speed * modifier;
	}if ((68 in keysDown)&&paused==false) { // Player holding right
		player0.x += player0.speed * modifier;
	};

	//walls
	if(player0.x<=0){
		player0.x=0;
	};
	if(player0.x>=c.width-zombDim){
		player0.x=c.width-zombDim;
	};
	if(player0.y<=0){
		player0.y=0;
	};
	if(player0.y>=c.height-zombDim){
		player0.y=c.height-zombDim;
	};

//zombies
	for(var a in zombs){
		if(zombs[a].health<=0){
			zombs.splice(a,1);
		}
		zombs[a].distance=Math.sqrt(Math.pow(player0.x-zombs[a].x,2)+Math.pow(player0.y-zombs[a].y,2));
		//zombies move to player
		zombs[a].x+=(player0.speed*(player0.x-zombs[a].x)/zombs[a].distance)*modifier*speedRatio;
		zombs[a].y+=(player0.speed*(player0.y-zombs[a].y)/zombs[a].distance)*modifier*speedRatio;

		//mouse aimed at zombie
		/*if(
			(((player0.y+zombDim/2)-(zombs[a].y+zombDim/2))/((zombs[a].x+zombDim/2)-(player0.x+zombDim/2)))<=(mouseSlope+zombDim/zombs[a].distance) &&
			(((player0.y+zombDim/2)-(zombs[a].y+zombDim/2))/((zombs[a].x+zombDim/2)-(player0.x+zombDim/2)))>=(mouseSlope-zombDim/zombs[a].distance) &&
			((//RESTRICT THE DOMAIN
				zombs[a].x>player0.x&&
				mouseX>player0.x
			)||(
				zombs[a].x<player0.x&&
				mouseX<player0.x
			))//RESTRICT THE DOMAIN
			){
			//console.log("aimed at zombie "+a);
			//backgroundColor="#faa";
			zombs[a].losingHealth=true;

		}else{
			//backgroundColor="#aaf";
			zombs[a].losingHealth=false;
		}*/ //MOVED TO SHOOT()

		if(
			zombs[a].x<player0.x+zombDim&&
			zombs[a].x>player0.x-zombDim&&
			zombs[a].y<player0.y+zombDim&&
			zombs[a].y>player0.y-zombDim
		){
			touchPlayer[a]=1;
		}else{
			touchPlayer[a]=0;
		}
		if(zombs[a].touchPlayer){
			player0.touchZomb=true;//NEVER GOES TO FALSE
		}

		for(var b in zombs){
			if(a!=b){
				if(
					zombs[a].x<zombs[b].x+10&&
					zombs[a].x>zombs[b].x-10&&
					zombs[a].y<zombs[b].y+10&&
					zombs[a].y>zombs[b].y-10
				){
					//delete zombs[a];
					zombs.splice(a,1);
					delete touchPlayer[a];
				};
			};
		};
	};
	};//end if(paused==false);
};//end update

var render = function () {
	if(paused==false){
	ctx.fillStyle=backgroundColor;
	ctx.fillRect(0,0,c.width,c.height);

	//draw zombies
	for(var a in zombs){
		ctx.fillStyle="#afa";
		ctx.fillRect(zombs[a].x,zombs[a].y,zombDim,zombDim);
		ctx.strokeRect(zombs[a].x,zombs[a].y,zombDim,zombDim);
		ctx.fillStyle = "#000";
		ctx.fillText(zombs[a].health,zombs[a].x+zombDim/2,zombs[a].y+zombDim/2);

		/*ctx.beginPath();
		ctx.arc(zombs[a].x, zombs[a].y, zombDim,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();*/

		//line and words for visualization

		//(player0.y+zombDim/2-zombs[a].y+zombDim/2+zombDim)/(zombs[a].x+zombDim/2-player0.x+zombDim/2-zombDim)
		ctx.beginPath();
		ctx.moveTo(player0.x+zombDim/2,player0.y+zombDim/2);
		ctx.lineTo(mouseX,mouseY);
		ctx.stroke();

		/*ctx.beginPath();
		ctx.moveTo(zombs[a].x,zombs[a].y);
		ctx.lineTo(player0.x+zombDim,player0.y+zombDim);
		ctx.stroke();
		ctx.fillStyle = "#000";
		ctx.fillText("D: "+zombs[a].distance,(player0.x+zombs[a].x)/2,(player0.y+zombs[a].y)/2);

		ctx.beginPath();
		ctx.moveTo(zombs[a].x,zombs[a].y);
		ctx.lineTo(player0.x+zombDim,zombs[a].y);
		ctx.stroke();
		ctx.fillStyle = "#000";
		ctx.fillText("Y: "+(player0.x-zombs[a].x),(player0.x+zombs[a].x)/2+10,zombs[a].y+10);

		ctx.beginPath();
		ctx.moveTo(zombs[a].x,zombs[a].y);
		ctx.lineTo(zombs[a].x,player0.y+zombDim);
		ctx.stroke();
		ctx.fillStyle = "#000";
		ctx.fillText("X: "+(player0.y-zombs[a].y),zombs[a].x-10,(player0.y+zombs[a].y)/2-10);*/
	};
	//draw player
	ctx.fillStyle="#fdd";
	ctx.fillRect(player0.x,player0.y,zombDim,zombDim);
	ctx.strokeRect(player0.x,player0.y,zombDim,zombDim);
	ctx.fillStyle = "#000";
	ctx.fillText(player0.health,player0.x+zombDim/2,player0.y+zombDim/2);

	//draw words
	//ctx.fillText("words",c.width/2,25); //((mouseY-zombs[a].y-zombDim)/(zombs[a].x-zombDim-mouseX))<mouseSlope

	ctx.beginPath();
	ctx.arc(mouseX, mouseY, 5,0,2*Math.PI);
	ctx.stroke();
	};//end if(paused==false);
};//end render

setInterval(function(){
	update(updateSpeed/2000);
	render();
	//console.clear();
},updateSpeed);
//boxheads
