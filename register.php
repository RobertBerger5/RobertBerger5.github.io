<html>
<head>
</head>
<body>
  <form method="post" action="register.php">
    <p>username:</p>
    <input type="text" name="username" /><br />
    <p>password:</p>
    <input type="password" name="password" /><br />
    <input type="submit" value="Submit">
  </form>
  <p>Already have an account? <a href="login.php">Log in</a>.</p>
<?php
require 'functions.php';

if(!empty($_POST)){
  $username=$_POST["username"];
  $password_unhashed=$_POST["password"];
  $password=password_hash($password_unhashed,PASSWORD_DEFAULT);//encrypt it using PHP's built-in password encryptor, which should be bcrypt with randomly generated salts that are stored in the string itself
}else{
   echo "<p>Fill out the form above to create an account. Everything should be secure, but don't reuse a password used for other services (better safe than sorry).";
   die("</body></html>");
}

$conn=connect();

$result=mySQL($conn,'SELECT EXISTS(SELECT * FROM users WHERE username=?)',array($username)); //if someone with that username is already in the database
if($result){
  echo "Can't register a new account with that username, it already exists<br />";
  //die("unable to create user because of non-unique name<br />");
  //temp for testing
  $sql="DELETE FROM users WHERE username=\"$username\";";
  $conn->query($sql);
}

$result=mySQL($conn,'INSERT INTO users (username,password) VALUES (?,?);',array($username,$password));
if($result){
  echo "yup<br />";
}else{
  echo "nope<br />";
}

//double-check
echo auth($conn,$username,$password_unhashed);

?>
</body>
</html>
