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
  <link rel="icon" type="image/png" href="images/slayericon.ico" />
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
$servername="localhost";
//user made on the database that has full priviledges
//to my knowledge, you'd have to be able to SSH into this server to make any use of this knowledge, so I'm good with this info being on GitHub. If you find a way to make SQL queries to my database, please let me know. Don't hack me, thanks in advance :)
$username="adminguy";
$password="p4sSw0rD";
$dbname="website";

$connectIP=$_SERVER['REMOTE_ADDR'];
$connectIP_long=ip2long($connectIP);
if(!empty($_POST)){
  $rating=$_POST["rate"];
}
//echo "Your IP is: ${connectIP}, or ${connectIP_long}<br />";
//echo "You rated $rating<br />";

$conn = new mysqli($servername,$username,$password,$dbname);
if($conn->connect_error){
  die("Connection failed: ". $conn->connect_error);
}

$sql = "SELECT * FROM ratings WHERE ip=$connectIP_long;";
$result=$conn->query($sql);

if($result->num_rows > 0 && isset($rating)){
  $row=$result->fetch_assoc();
  echo "<p>Looks like you've already submitted an answer from IP: " . $row["rating"] . " stars</p>";
  echo "<button type=\"button\" onclick=\"changeRating($connectIP_long,$rating)\">Change Rating to $rating</button><button type=\"button\" onclick=\"deleteRating($connectIP_long)\">Delete Rating</button>";
  //TODO: reload the "Average Rating" thingie
}else if(isset($rating)){
  $sql = "INSERT INTO ratings (ip,rating,date) VALUES ($connectIP_long,$rating,CURDATE());";
  $result=$conn->query($sql);
  echo "<p>Thanks for your rating of $rating, it has been added</p>";
}else{
  echo "<p>To submit an answer, go to the <a href=\"/\">main page</a> and click one of the buttons under \"Web Development\" and then click \"Rate\"!</p>";
}

$sql = "SELECT AVG(rating) FROM ratings;";
$result=$conn->query($sql);
if($result->num_rows>0){
  $row=$result->fetch_assoc();
  echo "<h1>Average rating:" . $row["AVG(rating)"] . "</h1><br />";
}

$conn->close();
//TODO: page is really empty down here...would look super cool if I put like a graph or something of ratings and when they occurred, or really just anything to fill the space.
?>
  </div>
</body>

</html>
