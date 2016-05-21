/*SC.initialize({
      client_id: "8a7a1ab91d6a4182bfd718ee80812e00",
      redirect_uri: "http://robertberger5.github.io/void/callback.html",
  });

  var userId = 39090345; // user_id of Prutsonic

  SC.get("/tracks", {
      user_id: userId,
      limit: 100
  }, function (tracks) {



      for (var i = 0; i < tracks.length; i++) {
          console.log(tracks[i].title);
      }

  });*/

  SC.initialize({
      client_id: "8a7a1ab91d6a4182bfd718ee80812e00",
      redirect_uri: "http://robertberger5.github.io/void/callback.html",
  });

  var userId = 39090345; // user_id of Prutsonic

  SC.get("/tracks", {
      user_id: userId,
      limit: 100
  }, function (tracks) {

      var tmp = '';

      for (var i = 0; i < tracks.length; i++) {
            console.log(tracks[i].title);

          tmp = '<a href="' + tracks[i].permalink_url + '">' + tracks[i].title + ' - ' + tracks[i].duration + '</a>';

          $("<p/>").html(tmp).appendTo("#main");
      }

  });
