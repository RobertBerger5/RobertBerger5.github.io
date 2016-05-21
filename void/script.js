function loadFile(href){
	$("#main")
		//.fadeOut(1000)
		.load("http://robertberger5.github.io/void/"+href)
		//.fadeIn(1000)
	;
};




SC.initialize({
	client_id: "8ee7b3067929d0440f7065ad8874cad8",
	redirect_uri: "http://robertberger5.github.io/void/callback.html",
});

var userId = 205809940; //OUR FUCKING USER ID YAY
  
$(document).ready(function() {
	SC.get("/tracks", {
		user_id: userId
	}, function (tracks) {
		for(var a in tracks){
			console.log(a+": "+tracks[a].title)
		}
		//SC.oEmbed(tracks[0].permalink_url,document.getElementById('player')) //change the index of the array for different songs
		
		console.log(tracks);
		console.log(tracks[0]);
		SC.stream('/tracks/'+ tracks[0].id ,function(sound){
        		$("#leftDiv").click(function(e){
            			sound.start();
            			console.log("started");
        		});
        		$("#rightDiv").click(function(e){
        			    sound.stop();
        			    console.log("stopped");
        		});
    		});
	});
});






/*SC.initialize({
  client_id: '8ee7b3067929d0440f7065ad8874cad8'
});

$(document).ready(function() {
    SC.stream('/tracks/293',function(sound){
        $("#start").click(function(e){
            sound.start();
        });
        $("#stop").click(function(e){
            sound.stop();
        });
    });
});*/





