console.log("0");

$( document ).ready(function() {
  $('#content').fadeIn('slow');
});

function redirect(href){
  $('#content').fadeOut('fast', function(){
    window.location.href = "http://robertberger5.github.io/"+href;
  });
}
