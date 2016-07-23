var canvas=document.querySelector("canvas");
      canvas.width = $(window).width();
      canvas.height= $(window).height();
      var ctx = canvas.getContext("2d");


      //user determined?
      var length=500;//length of the field,   TODO: find a way to make it rely on canvas width and height
      var perspective=.55;//so things in the distance appear closer for perspective, .55 seemds to be the best
      var threeD=1;//display 3D or not
      var meters=0;//display easy to view x y z positions or not
      var gball=0;//diplay ghost ball or not
      var FPS=60;//frames per second, setting higher than 1/(updateSpeed*1000) is pointless <--(in this case, 10)
      var influence=.25;//how much the player flicking the mouse influences the ball's velocity


      //server controlled
      var updateSpeed=10;//time between setInterval loops
      var scaleShit=perspective*25;//scale it so they aren't scrunched

      //manipulate user input into something useful
      FPS=2/FPS*1000;//to get how many milliseconds are between each frame

      var paused=false;
      function togglePause(){
        if(paused){
          paused=false;
          renderFunc();
        }else{
          paused=true;
        }
      }

      var field={
        width:canvas.width, //x
        height:canvas.height, //y
        length:length //z
      }

      var player={
        a:0,//x of camera
        b:0,//z of camera

        x:field.width/2,
        y:field.height/2,
        width:field.width/4,
        height:field.height/4,
        curve:influence //how much the mouse flicks influence it
      }

      var ball={
        x:field.width/2,
        y:field.height/2,
        z:field.length/2,
        xV:0,
        yV:0,
        zV:3,
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

      function help(){
        paused=true;
        return("Welcome to CurveBall! To exit this help menu, type \"togglePause()\"\n\nTo change a setting, simply enter the name of the setting and set it equal to whatever value you want it to be. Example: \"length=500\" sets the length of the field to 500     SettingVariables:\nlength: the length of the field, anywhere from 100 to 1000 is a safe size, bigger screens can set it longer (I should really work on that...) (Default:500)\nperspective: to make things in the distance appear farther, feel free to fuck around with it (Default:.55)\nthreeD: enable 3D, set to true or false (Warning: may cause you to miss the ball, I should also work on that) (Default:true)\nmeters: display x y and z positions, set to either true or false (Default:false)\ngball: show the ghost of the ball with only the x and y coordanites, for cheaters only (Default:false)\nFPS: frames per second, setting it to more than 200 is pointless because of the speed that the game updates at (Default:60)\ninfluence: how much the player flicking the mouse influences the ball's velocity (Default:.25)\nball.(x,y,z,xV,yV,zV,radius): change ball.x to change the x position, xV to change the x velocity (you can dick with a ton of stuff in this game that way, I should work on that but eh oh well)\n\nTo call a function, use the function name and parentheses. Example: \"help()\"     Functions:\ntogglePause: toggles if the game is paused or not (use it when you're done looking at this help menu)\nresetBall: resets the ball, to be used if things get too chaotic to control\n")
      }

      function resetBall(){
        ball.x=field.width/2;
        ball.y=field.height/2;
        ball.z=field.length/2;
        ball.xV=0;
        ball.yV=0;
        ball.zV=3;
      }


      function point(winner){
        togglePause();
        console.log(winner+" scored!");
        setTimeout(function(){
          togglePause();
          lastMouseX=mouseX;
          lastMouseY=mouseY;
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

      // Main keys
      /*var keysDown = {};
      addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
        console.log(e.keyCode);
      }, false);
      addEventListener("keyup", function (e) {
        delete keysDown[e.keyCode];
      }, false);*/

      function calcPoint(x,y,dist){
        cW=field.width-Math.pow(dist,perspective)*scaleShit;
        cH=field.height-Math.pow(dist,perspective)*scaleShit;
        cX=(field.width-cW)/2//+player.a; getting WAY too crazy with this shit lmao
        cY=(field.height-cH)/2//+player.b;
        if(threeD){
          cX+=(field.width/2-mouseX)/5;//lower values make it less crazy, therefore making you more likely not to miss because of dumb shit that I should REALLY fucking fix
          cY+=(field.height/2-mouseY)/5;//ditto
        }
        var xN=x/field.width*cW+cX
        var yN=y/field.height*cH+cY
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
          bounced=true;
        }else if(ball.y-ball.radius<=0 && ball.yV<0){
          ball.yV=ball.yV*-1;
          bounced=true;
        }else if(ball.x+ball.radius>=field.width && ball.xV>0){
          ball.xV=ball.xV*-1;
          bounced=true;
        }else if(ball.y+ball.radius>=field.height && ball.yV>0){
          ball.yV=ball.yV*-1;
          bounced=true;
        }

        if(ball.z<=0 && ball.zV<0){
          ball.zV=ball.zV*-1;
          if(hitBall(player)){
            bounced=true;
          }else{
            point("enemy");
          }

          ball.xV+=(mouseX-lastmouseX)*player.curve;
          ball.yV+=(mouseY-lastmouseY)*player.curve;
        }else if(ball.z>=field.length && ball.zV>0){
          ball.zV=ball.zV*-1;
          if(hitBall(enemy)){
            bounced=true;
          }else{
            point("player");
          }
        }


        return bounced;
      }

      function updateBall(){
        ball.x+=ball.xV;
        ball.y+=ball.yV;
        ball.z+=ball.zV;
        if(bounceBall()){
        }
      }

      function update(){
        /*if(65 in keysDown){
          player.a+=10;
        }
        if(68 in keysDown){
          player.a-=10;
        }
        if(87 in keysDown){
          player.b+=10;
        }
        if(83 in keysDown){
          player.b-=10;
        }*/

        player.x=mouseX; //makes it so you don't always hit as you see it in 3D mode, TODO: fix hitboxes in 3D?
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
        ctx.fillRect(enem[0]-enemWidth/2,enem[1]-enemHeight/2,enemWidth,enemHeight);
        //lines in the field
        ctx.strokeStyle="#0f0";
        for(var i=0;i<=field.length;i+=100){
          var strokeString="rgb(0,"+(255-Math.floor(i/(field.length/200)))+",0)";
          //ctx.strokeStyle=strokeString; //fade farther lines, helps 3D look, diagonal lines look like shit
          //make a gradiant on the lines? maybe.
          var rect=calcPoint(0,0,i);
          ctx.beginPath();
          ctx.strokeRect(rect[2],rect[3],rect[4],rect[5]);
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
        var rad=ball.radius*(ballShit[4]/field.width+ballShit[5]/field.height)/2;
        ctx.arc(ballShit[0],ballShit[1],rad,0,2*Math.PI);
        ctx.closePath();
        ctx.fill();
        //ghost ball
        if(gball){
          ctx.fillStyle="rgba(0,255,0,.5";
          ctx.beginPath();
          ctx.arc(ball.x,ball.y,ball.radius,0,2*Math.PI);
          ctx.closePath();
          ctx.fill();
        }
        //ghost enemy
        //ctx.fillStyle="rgba(255,0,0,.5";
        //ctx.fillRect(enemy.x-enemy.width/2,enemy.y-enemy.height/2,enemy.width,enemy.height);

        //player
        ctx.fillStyle="rgba(0,0,255,.5)";
        ctx.fillRect(player.x-player.width/2,player.y-player.height/2,player.width,player.height);

        //ball distance meters
        if(meters){
          var size=10;
          ctx.fillStyle="#f00";
          ctx.fillRect(0,0,canvas.width,size);
          ctx.fillStyle="#0f0";
          ctx.fillRect(0,0,canvas.width*(ball.z/field.length),size);
          ctx.fillStyle="#f00";
          ctx.fillRect(ball.radius,canvas.height-size,canvas.width-ball.radius*2,size);
          ctx.fillStyle="#0f0";
          ctx.fillRect(ball.radius,canvas.height-size,canvas.width*(ball.x/field.width)-ball.radius,size);
          ctx.fillStyle="#f00"
          ctx.fillRect(0,ball.radius,size,canvas.height-ball.radius*2);
          ctx.fillStyle="#0f0";
          ctx.fillRect(0,ball.radius,size,canvas.height*(ball.y/field.height)-ball.radius);
        }
      }

      setInterval(function(){
        if(!paused){
          update();
          //sendShit();
        }
      },updateSpeed);

      var then=Date.now();
      function renderFunc(){
        if(!paused){
          var dif=Date.now()-then;
          then=Date.now();
          var time=FPS-dif
          setTimeout(function(){
            render();
            renderFunc();
            var d=new Date();
            //console.log(d.getSeconds());//to show FPS
          },time);
          
        }
      }

      renderFunc();
