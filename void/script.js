function loadFile(href){
	$("#main")
		//.fadeOut(1000)
		.load("http://robertberger5.github.io/void/"+href)
		//.fadeIn(1000)
	;
};



//SOUNDCLOUD SHIT
SC.initialize({
	client_id: "8ee7b3067929d0440f7065ad8874cad8", //needs this to do anything
	redirect_uri: "http://robertberger5.github.io/void/callback.html", //need this if users log in for anythins
});

var userId = 205809940; //OUR FUCKING USER ID YAY
  
$(document).ready(function() {
	SC.get("/tracks", { //get all tracks from us
		user_id: userId
	}, function (tracks) { //tracks is an array
		for(var a in tracks){
			console.log(a+": "+tracks[a].title)
		}
		//for noobs, iframe imbedding
		//SC.oEmbed(tracks[0].permalink_url,document.getElementById('player')) //change the index of the array for different songs

		//for pros like me, streaming
		SC.stream(tracks[1].stream_url,{
			autoPlay:true //SoundManager 2 options
		},function(sound){ //sound is the center of attention now, it's the actual song
			
			
        		$("#leftDiv").click(function(e){ //start/resume the sound when the button is clicked
            			sound.start();
            			console.log("started");
        		});
        		$("#rightDiv").click(function(e){ //pause the sound when the button is clicked
        			    sound.pause();
        			    console.log("paused");
        		});
        		setInterval(function(){ //return the value in milliseconds of how far into the song we are
        			console.log(sound.position);
        		},100);
        		//TODO: fancy bar that says how long it's been playing, how much is left, and (most importantly) gives the user the ability to change the position (how far into the song they are) somehow
        		
        		
    		});
	});
});
