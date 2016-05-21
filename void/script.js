function loadFile(href){
	$("#main")
		//.fadeOut(1000)
		.load("http://robertberger5.github.io/void/"+href)
		//.fadeIn(1000)
	;
};
loadFile('home.html');

  SC.initialize({
      client_id: "8ee7b3067929d0440f7065ad8874cad8",
      redirect_uri: "http://robertberger5.github.io/void/callback.html",
  });

  var userId = 205809940; //OUR FUCKING USER ID YAY

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
