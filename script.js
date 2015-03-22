console.log("0");

$( document ).ready(function() {
  $('#content').fadeIn(500);
});

function redirect(href){
  $('#content').fadeOut(500, function(){
    window.location.href = "http://robertberger5.github.io/"+href;
  });
}

$('.link')
  .mouseover(function() {
    $(this).animate({backgroundColor: "#fff"}, 'slow');
  })
  .mouseout(function() {
    $(this).animate({backgroundColor:"#000"},'slow');
  });
