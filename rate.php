<?php
   session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Rob Berger</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
  <link rel="stylesheet" href="stylesheet.css">
  <link rel="icon" type="image/png" href="media/slayericon.ico" />
</head>
<body>
  <script>
    //called by buttons, takes arguments that PHP sets
    function changeRating(ipLong,newRating){
      $.ajax({
        url:'changeRating.php',
        type:'POST',
        data:{
          ip:ipLong,
          rating:newRating
        },
        success: function(msg){
          console.log(msg);
        }
      });
    }
    function deleteRating(ipLong){
      $.ajax({
        url:'deleteRating.php',
        type:'POST',
        data:{
          ip:ipLong
        },
        success: function(msg){
          console.log(msg);
        }
      });
    }
  </script>
  <br />
  <div class="container rounded header text-center">
    <br />
    <p><b>Welcome to the page that shows I can use PHP and MySQL!</b></p>
<?php
require 'functions.php';
   
/*$servername="localhost";
$username="adminguy";
$password="p4sSw0rD";
$dbname="website";

$conn = new mysqli($servername,$username,$password,$dbname);*/
$conn=connect();
/*if($conn->connect_error){
  die("Connection failed: ". $conn->connect_error);
}*/

if(!empty($_POST)){
  $rating=$_POST["rate"];//TODO: check if setting filter.default in php.ini actually filters out dangerous things
}
$connectIP=$_SERVER['REMOTE_ADDR'];
$connectIP_long=ip2long($connectIP);
//echo "Your IP is: ${connectIP}, or ${connectIP_long}<br />";
//echo "You rated $rating<br />";

$result=mySQL($conn,'SELECT * FROM ratings WHERE ip = ?',array($connectIP_long));
if($result=="ERR"){//TODO: this doesn't seem to work?
  die("couldn't prepare statement");
}

if($result->num_rows > 0 && isset($rating)){
  $row=$result->fetch_assoc();
  echo "<p>Looks like you've already submitted an answer from IP: " . $row["rating"] . " stars</p>";
  echo "<button type=\"button\" onclick=\"changeRating($connectIP_long,$rating)\">Change Rating to $rating</button><button type=\"button\" onclick=\"deleteRating($connectIP_long)\">Delete Rating</button>";
  //TODO: reload the "Average Rating" thingie
}else if(isset($rating)){
  //$sql = "INSERT INTO ratings (ip,rating,date) VALUES ($connectIP_long,$rating,CURDATE());";
  //$result=$conn->query($sql);
  $result=mySQL($conn,'INSERT INTO ratings (ip,rating,date) VALUES ( ? , ? ,CURDATE())',array($connectIP_long,$rating));
  echo "<p>Thanks for your rating of $rating, it has been added</p>";
}else{
  echo "<p>To submit an answer, go to the <a href=\"/\">main page</a> and click one of the buttons under \"Web Development\" and then click \"Rate\"!</p>";
}

//no user input, so this is safe from SQL injection?
$sql = "SELECT AVG(rating) FROM ratings;";
$result=$conn->query($sql);
if($result->num_rows>0){
  $row=$result->fetch_assoc();
  echo "<h1>Average rating:" . $row["AVG(rating)"] . "</h1><br />";
}

if (isset($_SESSION["username"])){
  echo "<p>logged in as ".$_SESSION["username"]."</p>";
}else{
  echo "<p>please <a href='login.php'>log in</a> or <a href='register.php'>register</a> to leave a comment</p>";
}

//TODO: display all comments here

$conn->close();
//TODO: page is really empty down here...would look super cool if I put like a graph or something of ratings and when they occurred, or really just anything to fill the space.
?>
    <p>That's really all there is to be seen on this page, you can head back to the <a href="/index.html">main page</a> now if you'd like</p>
  </div>
</body>

</html>
