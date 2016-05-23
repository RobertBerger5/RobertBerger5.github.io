function loadFile(href){
    $("#main")
        //.fadeOut(1000)
        .load("http://robertberger5.github.io/void/"+href)
        //.fadeIn(1000)
    ;
};

function millisecondToTime(millis){
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

SC.initialize({
    client_id: "8ee7b3067929d0440f7065ad8874cad8", //needs this to do anything
    redirect_uri: "http://robertberger5.github.io/void/callback.html", //need this if users log in for anythins
});

var userId = 205809940; //OUR FUCKING USER ID YAY





function playSong(sound){ //sound is the center of attention now, it's the actual song     TODO: make this function another function so when I call soundManager.stopAll(); (?), I can easily play a different sound without hassle
                
    $("#soundButton").click(function(e){
        if(sound.paused){
            sound.resume(); //play/resume
            document.getElementById("buttonSound").src="https://cdn1.iconfinder.com/data/icons/material-audio-video/20/pause-circle-outline-128.png";
        }else if(!sound.paused){
            sound.pause(); //pause
            document.getElementById("buttonSound").src="http://image005.flaticon.com/1/png/512/0/375.png";
            
        }else{
            console.log("wat"); //shouldn't happen ever
        }
    });
 
    var percentPlayed=0;
    //console.log(sound.duration);
    setInterval(function(){ //every so often it changes the widths of how much we've heard and not heard and says the times
        percentPlayed=100*(sound.position/sound.durationEstimate);
        document.getElementById("heard").style.width=percentPlayed + "%";
        document.getElementById("unheard").style.width=(100-percentPlayed) + "%";
        document.getElementById("timePlayed").innerHTML=millisecondToTime(sound.position);
        document.getElementById("timeLeft").innerHTML=millisecondToTime(sound.durationEstimate);
    },100);
    
    $("#songSpot").click(function(e) {  //change the position of the song based on where the user clicks on songSpot
        var offset = $(this).offset();//not 100% on how this works
        var relativeX = (e.pageX - offset.left);//same with this tbh
        var percentOfSong=relativeX/ $("#songSpot").width();//percentage of song that the user clicked
        sound.setPosition( percentOfSong * sound.durationEstimate );//change the position of the song
    });
}

function newSong(song){
    soundManager.stopAll();
    console.log(song);
    
    var trackUrl = 'https://soundcloud.com/user-54323444/'+song;
    $.get(
        'http://api.soundcloud.com/resolve.json?url=' + trackUrl + '&client_id=8ee7b3067929d0440f7065ad8874cad8', 
        function (track) {
            console.log(track);
            SC.stream(track.stream_url,{
                autoPlay:true //SoundManager 2 options
            },function(sound){ //sound object is the center of attention now, it's the actual song
                playSong(sound);
            });
        }
    );
    
    
}


$(document).ready(function() {
    loadFile('home.html');
    
    //SOUNDCLOUD SHIT
    SC.get("/tracks", { //get all tracks from us
        user_id: userId
    }, function (tracks) { //tracks is an array
        for(var a in tracks){
            urlName=(tracks[a].title).replace(/\s+/g, '-').toLowerCase() // "Bulls on Parade" becomes "bulls-on-parade"
            $("#selector").append( '<div class="song" onclick="newSong(\''+ urlName +'\')" width="' + (100/tracks.length) + '%"><p>'+tracks[a].title+'</p></div>' );
        }
        //for noobs, iframe imbedding
        //SC.oEmbed(tracks[0].permalink_url,document.getElementById('player')) //change the index of the array for different songs

        //for pros like me, streaming
        randy=Math.floor(Math.random()*tracks.length));
        SC.stream(tracks[randy].stream_url,{
            autoPlay:true //SoundManager 2 options
        },function(sound){ //sound object is the center of attention now, it's the actual song
            playSong(sound);
        });
    });
});
