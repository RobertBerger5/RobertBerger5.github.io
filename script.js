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
    $(this).animate({backgroundColor: "#f00"}, 'slow');
  })
  .mouseout(function() {
    $(this).animate({backgroundColor:"#444"},'slow');
  });
