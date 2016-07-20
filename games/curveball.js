var canvas=document.querySelector("canvas");
      canvas.width = $(window).width()/2;//500
      canvas.height= $(window).height();//500
      var ctx = canvas.getContext("2d");

      var scaleShit=1.5; //highest I can go without it going negative for whatever reason is 1.65 at 400, didn't work tho
      var threeD=0;

      var paused=false;
      function togglePause(){
        console.log("yeet");
        if(paused){
          paused=false;
        }else{
          paused=true;
        }
      }

      var player={
        x:canvas.width/2,
        y:canvas.height/2,
        width:canvas.width/4,
        height:canvas.height/4,
        curve:1
      }

      var field={
        width:canvas.width, //x
        height:canvas.height, //y
        length:300 //z 400
      }

      var ball={
        x:field.width/2,
        y:field.height/2,
        z:field.length,
        xV:0,
        yV:0,
        zV:10,
        xA:0,
        yA:0,
        zA:0,
        radius:50
      }

      var enemy={
        x:field.width/2,
        y:field.height/2,
        width:canvas.width*2,
        height:canvas.height*2,
        speed:3
      }

      var mouseX=0;
      var mouseY=0;
      var lastmouseX=mouseX;
      var lastmouseY=mouseY;

      function getMousePos(canvas,evt){
        var rect=canvas.getBoundingClientRect();
        return{
          x:evt.clientX-rect.left,
          y:evt.clientY-rect.top
        };
      }
      canvas.addEventListener('mousemove',function(evt){
        lastmouseX=mouseX;
        lastmouseY=mouseY;
        var mousePos=getMousePos(canvas,evt);
        mouseX=mousePos.x;
        mouseY=mousePos.y;
      });

      function calcPoint(x,y,dist){
        if(dist<=0){
          dist=1;
        }

        cW=canvas.width-dist*scaleShit;
        cH=canvas.height-dist*scaleShit;
        if(threeD){
          cX=(canvas.width-cW)/3 +(canvas.width/2 - mouseX)/2;
          cY=(canvas.height-cH)/3 +(canvas.height/2 - mouseY)/2;
        }else{
          cX=(canvas.width-cW)/3;
          cY=(canvas.height-cH)/3;
        }
        var xN=x/canvas.width*cW+cX*(1+x/canvas.width);
        var yN=y/canvas.height*cH+cY*(1+y/canvas.height);
        return[xN,yN,cX,cY,cW,cH];//returns x, y, canvas x, canvas y, canvas width, canvas height
      }

      function hitBall(person){
        if(
          ball.x-ball.radius<=person.x &&
          ball.x+ball.radius>=person.x &&
          ball.y-ball.radius<=person.y &&
          ball.y+ball.radius>=person.y
        ){
          return true;
        }else{
          return false;
        }
      }

      function bounceBall(){
        bounced=false;
        if(ball.x-ball.radius<=0 && ball.xV<0){
          ball.xV=ball.xV*-1;
          ball.xA=ball.xA*-1;
          bounced=true;
        }else if(ball.y-ball.radius<=0 && ball.yV<0){
          ball.yV=ball.yV*-1;
          ball.yA=ball.yA*-1;
          bounced=true;
        }else if(ball.x+ball.radius>=field.width && ball.xV>0){
          ball.xV=ball.xV*-1;
          ball.xA=ball.xA*-1;
          bounced=true;
        }else if(ball.y+ball.radius>=field.height && ball.yV>0){
          ball.yV=ball.yV*-1;
          ball.yA=ball.yA*-1;
          bounced=true;
        }

        if(ball.z<=0 && ball.zV<0 && hitBall(player)){
          ball.zV=ball.zV*-1;
          ball.zA=ball.zA*-1;
          bounced=true;

          ball.xV+=(mouseX-lastmouseX)*player.curve; //used to have it control acceleration but that was too crazy
          ball.yV+=(mouseY-lastmouseY)*player.curve;
        }else if(ball.z>=field.length && ball.zV>0 /*&& hitBall(enemy)*/){
          ball.zV=ball.zV*-1;
          ball.zA=ball.zA*-1;
          bounced=true;
        }


        return bounced;
      }

      function updateBall(){
        ball.xV+=ball.xA;
        ball.yV+=ball.yA;
        ball.zV+=ball.zA;
        ball.x+=ball.xV;
        ball.y+=ball.yV;
        ball.z+=ball.zV;
        if(bounceBall()){
          console.log("bounced");
        }
      }

      function update(){
        player.x=mouseX;
        player.y=mouseY;
        updateBall();

        if(enemy.x<ball.x){
          enemy.x+=enemy.speed;
        }else{
          enemy.x-=enemy.speed;
        }
        if(enemy.y<ball.y){
          enemy.y+=enemy.speed;
        }else{
          enemy.y-=enemy.speed;
        }
      }

      function render(){
        //black background
        ctx.fillStyle="#000";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        //enemy
        var enem=calcPoint(enemy.x,enemy.y,field.length);
        ctx.fillStyle="#f00";
        var drawx=enemy.x/canvas.width*enem[4]+enem[2]*1.5;
        var drawy=enemy.y/canvas.height*enem[5]+enem[3]*1.5;
        var draww=enemy.width/canvas.width*enem[4];
        var drawh=enemy.height/canvas.height*enem[5];
        //ctx.fillRect(drawx,drawy,draww,drawh); //not drawn to perspective scale

        //lines in the field
        ctx.strokeStyle="#0f0";
        for(var i=0;i<=field.length;i+=field.length/5){
          var strokeString="rgb(0,"+(325-Math.floor(i/(field.length/255)))+",0)";
          ctx.strokeStyle=strokeString; //fade farther lines, helps 3D look, diagonal lines look like shit
          //make a gradiant on the lines? maybe.
          var rect=calcPoint(0,0,i);
          ctx.beginPath();
          ctx.strokeRect(rect[2]*1.5,rect[3]*1.5,rect[4],rect[5]);//used to add x to widths
          ctx.stroke();
        }
        var close=calcPoint(0,0,0);
        var far=calcPoint(0,0,field.length);
        var numthing=1.5;
        ctx.strokeStyle="#0f0";
        ctx.beginPath();
        ctx.moveTo(close[2]*numthing,close[3]*numthing);
        ctx.lineTo(far[2]*numthing,far[3]*numthing);
        ctx.moveTo(close[2]*numthing+close[4],close[3]*numthing);
        ctx.lineTo(far[2]*numthing+far[4],far[3]*numthing);
        ctx.moveTo(close[2]*numthing,close[3]*numthing+close[5]);
        ctx.lineTo(far[2]*numthing,far[3]*numthing+far[5]);
        ctx.moveTo(close[2]*numthing+close[4],close[3]*numthing+close[5]);
        ctx.lineTo(far[2]*numthing+far[4],far[3]*numthing+far[5]);
        ctx.stroke();
        /*ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(lastC.x,lastC.y);
        ctx.moveTo(field.width,0);
        ctx.lineTo(lastC.x*2+lastC.w,lastC.y);
        ctx.moveTo(0,field.height);
        ctx.lineTo(lastC.x,lastC.y*2+lastC.h);
        ctx.moveTo(field.width,field.height);
        ctx.lineTo(lastC.x*2+lastC.w,lastC.y*2+lastC.h);
        ctx.stroke();*/

        var ballShit=calcPoint(ball.x,ball.y,ball.z); //returns new x, new y, canvas x, canvas y, canvas width, canvas height
        //rectangle showing ball z position
        ctx.strokeStyle="#fff";
        ctx.strokeRect(ballShit[2]*1.5,ballShit[3]*1.5,ballShit[4],ballShit[5]);//used to add x and y to w and h
        //ball
        ctx.fillStyle="#0f0";
        ctx.beginPath();
        var adjust=scaleShit*100;
        var rad=ball.radius*adjust/(ball.z+adjust);
        if(rad>=0){
          ctx.arc(ballShit[0],ballShit[1],rad,0,2*Math.PI); //fine at both ends but not the middle, wtf
        }else{
          paused=true;
          console.log("YOU LOSE");
        }
        ctx.closePath();
        ctx.fill();
        //ghost ball
        ctx.fillStyle="rgba(0,255,0,.5";
        ctx.beginPath();
        ctx.arc(ball.x,ball.y,ball.radius,0,2*Math.PI); //fine at both ends but not the middle, wtf
        ctx.closePath();
        //ctx.fill();
        //ghost enemy
        ctx.fillStyle="rgba(255,0,0,.5";
        //ctx.fillRect(enemy.x-enemy.width/2,enemy.y-enemy.height/2,enemy.width,enemy.height);

        //player
        ctx.fillStyle="rgba(0,0,255,.5)";
        ctx.fillRect(player.x-player.width/2,player.y-player.height/2,player.width,player.height);
        //ball distance meter
        ctx.fillStyle="#f00";
        ctx.fillRect(0,0,canvas.width,10);
        ctx.fillStyle="#0f0";
        ctx.fillRect(0,0,canvas.width*(ball.z/field.length),10);
      }

      setInterval(function(){
        if(!paused){
          update();
          render();
          //sendShit();
        }
      },50);
