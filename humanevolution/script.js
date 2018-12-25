console.log("0");

$( document ).ready(function() {
  $('#content').fadeIn(500);
});

function redirect(href){
  $('#content').fadeOut(500, function(){
    window.location.href = "http://robertberger5.github.io/humanevolution/"+href;
  });
};

$('p')
.mouseover(function() {
  $(this).css('background-color','#3a3').animate({backgroundColor: '#f00'},{duration:100});
})
.mouseout(function() {
  $(this).css('background-color','#f00').animate({backgroundColor: '#3a3'},{duration:100});
});

/*$('body').click(function(){
  $( "p" ).animate({
    width: "70%",
    opacity: 0.4,
    marginLeft: "0.6in",
    fontSize: "3em",
    borderWidth: "10px"
  }, 1500 );
});*/
