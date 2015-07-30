document.getElementById("out").src="http://i.imgur.com/iCMc1in.png";
document.getElementById("in").src="http://i.imgur.com/G7s8YfL.png";
document.getElementById("jizz").src="http://i.imgur.com/pnLXJqU.png";
var out = true;
var creamed=false;
document.getElementById("jizz").onclick=function(){
	if(creamed){
		location.reload();
	}else{
		creamed=true;
	}
};
setInterval(function(){
	if(creamed){
		document.getElementById("jizz").style.opacity=1;
	}else{
		if(out){
			document.getElementById("in").style.opacity=1;
			out=false;
		}else{
			document.getElementById("in").style.opacity=0;
			out=true;
		};
	};
},100);
