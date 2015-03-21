console.log("0");

$( document ).ready(function() {
  $('#content').fadeIn(5000);
});

function redirect(href){
  $('#content').fadeOut('fast', function(){
    window.location.href = "http://robertberger5.github.io/"+href;
  });
}
