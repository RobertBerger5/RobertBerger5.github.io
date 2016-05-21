SC.initialize({
  client_id: '8a7a1ab91d6a4182bfd718ee80812e00'
});

$(document).ready(function() {
  SC.get('/tracks', { genres: 'shit' }, function(tracks) {
      console.log("shit");
    $(tracks).each(function(index, track) {
      $('#main').append($('<p></p>').html(track.title + ' - ' + track.genre));
    });
  });
});
