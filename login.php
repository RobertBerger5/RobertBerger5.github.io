<?php
  session_start();
?>
<html>
<head>
</head>
<body>
  <form method="post" action="login.php">
    <p>username:</p>
    <input type="text" name="username" /><br />
    <p>password:</p>
    <input type="password" name="password" /><br />
    <input type="submit" value="Submit">
  </form>
  <p>Alternatively, <a href="register.php">register here</a>.</p>
<?php
require 'functions.php';

if(!empty($_POST)){
  $username=$_POST["username"];
  $password_unhashed=$_POST["password"];
  $password=password_hash($password_unhashed,PASSWORD_DEFAULT);//encrypt it using PHP's built-in password encryptor, which should be bcrypt with randomly generated salts that are stored in the string itself
}else if(isset($_SESSION["username"])){
  echo "<p>Already logged in as ".$_SESSION["username"].". <a href='logout.php'>Log out?</a></p>";
}else{
   echo "<p>Fill out the form above to log in.";
   die("</body></html>");
}

$conn=connect();

//double-check
if(auth($conn,$username,$password_unhashed)){
  $_SESSION["username"]=$username;
  $_SESSION["password"]=$password_unhashed;
  echo "<p>successfully logged in. <a href='rate.php'>go here to leave a comment</a></p>";
}else{
  echo "<p>ERROR: authentication failure.</p>";
  session_destroy();
}

?>
</body>
</html>
