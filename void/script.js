function loadFile(href){
	$("#main")
		.fadeOut(1000)
		.load("http://robertberger5.github.io/void/"+href)
		.fadeIn(1000)
	;
};

SC.initialize({
	client_id: 'Void_Official',
	redirect_uri: 'robertberger5.github.io/index.html'
});

SC.connect().then(function() {
  return SC.get('/me');
}).then(function(me) {
  alert('Hello, ' + me.username);
});


$(document).ready(function(){
	//loadFile("template.html");
	$("#main").load("http://robertberger5.github.io/void/template.html");


	$(document).ready(function() {
		SC.get('/tracks', { genres: 'Metal' }, function(tracks) {
			$(tracks).each(function(index, track) {
				//$('#main').append($('<li></li>').html(track.title + ' - ' + track.genre));
				console.log(track.title + ' - ' + track.genre);
			});
		});
	});


});
