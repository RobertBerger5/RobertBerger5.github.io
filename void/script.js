SC.initialize({
      client_id: "8a7a1ab91d6a4182bfd718ee80812e00",
      redirect_uri: "http://robertberger5.github.io/void/callback.html",
  });

/**
Once that's done you are all set and ready to call the SoundCloud API. 
**/

/**
Call to the SoundCloud API. 
Retrieves list of tracks, and displays a list with links to the tracks showing 'tracktitle' and 'track duration'
**/

  var userId = 39090345; // user_id of Prutsonic

  SC.get("/tracks", {
      user_id: userId,
      limit: 100
  }, function (tracks) {



      for (var i = 0; i < tracks.length; i++) {
          console.log(tracks[i].title);
      }

  });
