var canvas=document.querySelector("canvas");
      canvas.width = $(window).width();
      canvas.height= $(window).height();
      var ctx = canvas.getContext("2d");

      var pow=.55;//so things in the distance appear closer, perspective
      var scaleShit=pow*25;//scale it so they aren't scrunched
      var threeD=0;//1 or 0
      var meters=0;//1 or 0
      var gball=0;//1 or 0

      var paused=false;
      function togglePause(){
        //console.log("pause toggled");
        if(paused){
          paused=false;
        }else{
          paused=true;
        }
      }

      var field={
        width:canvas.width, //x
        height:canvas.height, //y
        length:500 //z
      }

      var player={
        x:field.width/2,
        y:field.height/2,
        width:field.width/4,
        height:field.height/4,
        curve:1 //how much the mouse flicks influence it
      }

      var ball={
        x:field.width/2,
        y:field.height/2,
        z:0,
        xV:0,
        yV:0,
        zV:3,
        xA:0,
        yA:0,
        zA:0,
        radius:50
      }

      var enemy={
        x:field.width/2,
        y:field.height/2,
        width:field.width/4,
        height:field.height/4,
        speed:2
      }

      var mouseX=0;
      var mouseY=0;
      var lastmouseX=mouseX;
      var lastmouseY=mouseY;

      function point(winner){
        paused=true;
        console.log("+1 point to "+winner);
        setTimeout(function(){
          paused=false;
        },1000);
      }

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
        cW=field.width-Math.pow(dist,pow)*scaleShit;
        cH=field.height-Math.pow(dist,pow)*scaleShit;
        cX=(field.width-cW)/2;
        cY=(field.height-cH)/2;
        if(threeD){
          cX+=(field.width/2 - mouseX)/2;
          cY+=(field.height/2 - mouseY)/2;
        }
        var xN=x/field.width*cW+cX//*(1+x/field.width);
        var yN=y/field.height*cH+cY//*(1+y/field.height);
        return[xN,yN,cX,cY,cW,cH];//returns x, y, canvas x, canvas y, canvas width, canvas height
      }

      function hitBall(person){ //3D mode complicates this...should I make it a function of mouseX and mouseY if threeD is enabled?
        if(
          ball.x-ball.radius<=person.x+person.width/2 &&
          ball.x+ball.radius>=person.x-person.width/2 &&
          ball.y-ball.radius<=person.y+person.height/2 &&
          ball.y+ball.radius>=person.y-person.height/2
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

        if(ball.z<=0 && ball.zV<0){
          ball.zV=ball.zV*-1;
          ball.zA=ball.zA*-1;
          if(hitBall(player)){
            bounced=true;
          }else{
            point("enemy");
          }

          ball.xV+=(mouseX-lastmouseX)*player.curve; //used to have it control acceleration but that was too crazy
          ball.yV+=(mouseY-lastmouseY)*player.curve;
        }else if(ball.z>=field.length && ball.zV>0){
          ball.zV=ball.zV*-1;
          ball.zA=ball.zA*-1;
          if(hitBall(enemy)){
            bounced=true;
          }else{
            point("player");
          }
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
          //console.log("bounced");
        }
      }

      function update(){
        player.x=mouseX; //makes it so you don't always hit as you see it in 3D mode
        player.y=mouseY; //ditto
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
        ctx.fillRect(0,0,field.width,field.height);
        //enemy
        var enem=calcPoint(enemy.x,enemy.y,field.length);
        ctx.fillStyle="#f00";
        var enemWidth=enemy.width*enem[4]/field.width;
        var enemHeight=enemy.height*enem[5]/field.height;
        ctx.fillRect(enem[0]-enemWidth/2,enem[1]-enemHeight/2,enemWidth,enemHeight); //not drawn to perspective scale
        //lines in the field
        ctx.strokeStyle="#0f0";
        for(var i=0;i<=field.length;i+=100){
          var strokeString="rgb(0,"+(255-Math.floor(i/(field.length/200)))+",0)";
          ctx.strokeStyle=strokeString; //fade farther lines, helps 3D look, diagonal lines look like shit
          //make a gradiant on the lines? maybe.
          var rect=calcPoint(0,0,i);
          ctx.beginPath();
          ctx.strokeRect(rect[2],rect[3],rect[4],rect[5]);//used to add x to widths
          ctx.stroke();
        }
        var close=calcPoint(0,0,0);
        var far=calcPoint(0,0,field.length);
        ctx.strokeStyle="#0f0";
        ctx.beginPath();
        ctx.moveTo(close[2],close[3]);
        ctx.lineTo(far[2],far[3]);
        ctx.moveTo(close[2]+close[4],close[3]);
        ctx.lineTo(far[2]+far[4],far[3]);
        ctx.moveTo(close[2],close[3]+close[5]);
        ctx.lineTo(far[2],far[3]+far[5]);
        ctx.moveTo(close[2]+close[4],close[3]+close[5]);
        ctx.lineTo(far[2]+far[4],far[3]+far[5]);
        ctx.stroke();

        var ballShit=calcPoint(ball.x,ball.y,ball.z); //returns new x, new y, canvas x, canvas y, canvas width, canvas height
        //rectangle showing ball z position
        ctx.strokeStyle="#fff";
        ctx.strokeRect(ballShit[2],ballShit[3],ballShit[4],ballShit[5]);//used to add x and y to w and h
        //ball
        ctx.fillStyle="#0f0";
        ctx.beginPath();
        var adjust=scaleShit*100;
        //var rad=ball.radius*adjust/(ball.z+adjust);
        var rad=ball.radius*(ballShit[4]/field.width+ballShit[5]/field.height)/2;
        ctx.arc(ballShit[0],ballShit[1],rad,0,2*Math.PI);//rad<0?
        ctx.closePath();
        ctx.fill();
        //ghost ball
        ctx.fillStyle="rgba(0,255,0,.5";
        ctx.beginPath();
        ctx.arc(ball.x,ball.y,ball.radius,0,2*Math.PI);
        ctx.closePath();
        if(gball){
            ctx.fill();
        }
        //ghost enemy
        ctx.fillStyle="rgba(255,0,0,.5";
        //ctx.fillRect(enemy.x-enemy.width/2,enemy.y-enemy.height/2,enemy.width,enemy.height);

        //player
        ctx.fillStyle="rgba(0,0,255,.5)";
        ctx.fillRect(player.x-player.width/2,player.y-player.height/2,player.width,player.height);

        //ball distance meters
        if(meters){
          ctx.fillStyle="#f00";
          ctx.fillRect(0,0,canvas.width,10);
          ctx.fillStyle="#0f0";
          ctx.fillRect(0,0,canvas.width*(ball.z/field.length),10);
          ctx.fillStyle="#f00";
          ctx.fillRect(ball.radius,canvas.height-10,canvas.width-ball.radius*2,10);
          ctx.fillStyle="#0f0";
          ctx.fillRect(ball.radius,canvas.height-10,canvas.width*(ball.x/field.width)-ball.radius,10);
          ctx.fillStyle="#f00"
          ctx.fillRect(0,ball.radius,10,canvas.height-ball.radius*2);
          ctx.fillStyle="#0f0";
          ctx.fillRect(0,ball.radius,10,canvas.height*(ball.y/field.height)-ball.radius);
        }
      }

      setInterval(function(){
        if(!paused){
          update();
          render();
          //sendShit();
        }
      },10);
