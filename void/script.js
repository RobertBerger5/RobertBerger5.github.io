function loadFile(href){
	$("#main")
		.fadeOut(1000)
		.load("http://robertberger5.github.io/void/"+href)
		.fadeIn(1000)
	;
};

SC.initialize({
	client_id: '8a7a1ab91d6a4182bfd718ee80812e00',
	redirect_uri: 'http://robertberger5.github.io/void/callback.html'
});


$(document).ready(function(){
	//loadFile("template.html");
	$("#main").load("http://robertberger5.github.io/void/template.html");

	SC.initialize({
		client_id: '8a7a1ab91d6a4182bfd718ee80812e00',
		redirect_uri: 'http://robertberger5.github.io/void/redirect_uri.html'
	});
	console.log("initialized");

	SC.connect().then(function() {
		return SC.get('/me');
	}).then(function(me) {
		alert('Hello, ' + me.username);
	});

	/*SC.connect(function(){
		console.log("e");
        SC.get('/me', function(me){
            alert(me.username);
        });*/
    });

	SC.get('/tracks', { genres: 'Metal' }, function(tracks) {
		console.log("yay?");
		$(tracks).each(function(index, track) {
			$('#main').append($('<li></li>').html(track.title + ' - ' + track.genre));
			console.log(track.title + ' - ' + track.genre);
		});
	});


});
