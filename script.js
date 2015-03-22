$( document ).ready(function() {
  $('#content').fadeIn(500);
});

function redirect(href){
  $('#content').fadeOut(500, function(){
    window.location.href = "http://robertberger5.github.io/"+href;
  });
};


$('body').click(function(){
  $( "p" ).animate({
    width: "70%",
    opacity: 0.4,
    marginLeft: "0.6in",
    fontSize: "3em",
    borderWidth: "10px"
  }, 1500 );
});
