//window.onload=function(){
    console.log("7:38");
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    c.height = $(window).height();
    c.width = $(window).width();

    //custom variables
    var grav=10;//how much gravity is pulling on it
    var bounce=.9;//how much higher it comes up after hitting the ground
    var friction=.9;//how much touching the ground slows it
    var spawnRate=000;//how fast projectiles spawn
    var projDim=50;//size of player
    var updateSpeed=5;//fps/update speed vs smoothness/functionality
    var maxProjs=10;//number of projectiles
    //var ProjMass=100;//¿mass of projectile?
    //preset variables
    var mouseX;
    var mouseY;
    var lastMouseX;
    var lastMouseY;
    var mouseDown=false;
    var currentProjs=0;

    //objects
	var projs=[];
	var proj=function(x,y,speedX,speedY,Color){
		return{
			x:x,
			y:y,
			speedX:speedX,
			speedY:speedY,
			Color:Color,
			caught:false,
			mouseOver:false
		}
	}
	//projs.push(proj(100,100,-100,-200,"#ff0000"));
	//projs.push(proj(200,100,100,1000,"#0000ff"));
	//projs.push(proj(300,100,1000,0,"#00ff00"));
	setInterval(function(){
		if(currentProjs<maxProjs){
			var projColor="#"+("000000"+Math.floor(Math.random()*16777215).toString(16)).slice(-6);
			projs.push(proj(
				Math.random()*c.width,//x position
				Math.random()*c.height,//y position
				Math.random()*2*c.width-c.width,//x velocity
				Math.random()*2*c.height-c.height,//y velocity
				projColor//color
			));
			currentProjs++;
		};
	},spawnRate);

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

var update=function(modifier){
	for(var a in projs){
		//general physics
		projs[a].speedY=projs[a].speedY+grav;//gravity
		projs[a].x+=projs[a].speedX*modifier;//
		projs[a].y+=projs[a].speedY*modifier;
		if(projs[a].x>=c.width-projDim){
			projs[a].x=c.width-projDim;
			projs[a].speedX=-projs[a].speedX;
		}
		if(projs[a].x<=projDim){
			projs[a].x=projDim;
			projs[a].speedX=-projs[a].speedX;
		}
		if(projs[a].y>=c.height-projDim){
			projs[a].y=c.height-projDim;
			projs[a].speedY=-(projs[a].speedY*bounce);
			projs[a].speedX=projs[a].speedX*friction;
		}
		if(projs[a].y<=projDim/2){
			projs[a].y=projDim/2;
			projs[a].speedY=-projs[a].speedY;
		};

		//mouse drag
		if(projs[a].caught==true&&projs[a].mouseOver==true){
			projs[a].x=mouseX;
			projs[a].y=mouseY;
			projs[a].speedX=(mouseX-lastMouseX)*(.1/modifier);//50
			projs[a].speedY=(mouseY-lastMouseY)*(.1/modifier);//50
			console.log(a);
		};
		if(
			projs[a].x<lastMouseX+projDim&&
			projs[a].x>lastMouseX-projDim&&
			projs[a].y<lastMouseY+projDim&&
			projs[a].y>lastMouseY-projDim
		){
			projs[a].mouseOver=true;
			if(mouseDown){
				projs[a].caught=true;
			}else{
				projs[a].caught=false;
			}
		}else{
			projs[a].mouseOver=false;
		};

		//projectile vs projectile collide
		for(var b in projs){
			if(a!=b){
				if(
					projs[a].x<projs[b].x+projDim&&
					projs[a].x>projs[b].x-projDim&&
					projs[a].y<projs[b].y+projDim&&
					projs[a].y>projs[b].y-projDim
				){
					if(projs[a].speedX+projs[b].speedX<.1){
						projs[a].speedY=(Math.random()-Math.random())*500 //wiggle to freedom
						//projs[a].x=projs[a].x+projDim/2; //teleport somewhere
						//projs[a].x=projs[b].x-projDim/2; // ^ needs work ^
					}else{
						projs[a].speedX=-projs[a].speedX*bounce;
						projs[a].speedY=-projs[a].speedY*bounce;//(projs[a].speedY+projs[b].speedY)/2
					};
				};
			};
		};
	};//end for
	lastMouseX=mouseX;
	lastMouseY=mouseY;
};//end update

var render = function () {
	ctx.fillStyle="#000";
	ctx.fillRect(0,0,c.width,c.height);

	for(var a in projs){
		ctx.fillStyle=projs[a].Color;
		//ctx.fillRect(projs[a].x, projs[a].y, projDim, projDim);
		ctx.beginPath();
		ctx.arc(projs[a].x, projs[a].y, projDim,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();
	};
	ctx.fillStyle = "#fff";
	ctx.font = "25px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("("+mouseX+","+mouseY+")",5,5);
	//ctx.fillText(mouseX-lastMouseX,5,35);
	//ctx.fillText(mouseY-lastMouseY,5,65);
};//end render

setInterval(function(){
	update(updateSpeed/2000);
	render();
	
},updateSpeed);
// The main game loop
/*var main = function () {
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
main();*/
//}
