<?php
//should only ever be used in AJAX calls or whatever
//TODO: sanatize inputs. This isn't actually used anywhere in the site yet, but it could be later
if(empty($_POST)){
  die("ERROR: no POST data\n");
}
$username=$_POST["username"];
$password=$_POST["password"];

$dbservername="localhost";
$dbusername="adminguy";
//$dbpassword="p4sSw0rD"; TODO: uncomment after sanitizing inputs...just to be safe...
$dbname="website";
$conn = new mysqli($dbservername,$dbusername,$dbpassword,$dbname);
if($conn->connect_error){
  die("Connection failed: ". $conn->connect_error)."\n";
}

$sql = "SELECT EXISTS(SELECT * FROM users WHERE username=\"$username\");";
if(!$conn->query($sql)){//no one with that username exists in the database
  die("ERROR: username not found in database\n");
}

$sql="SELECT * FROM users WHERE username=\"$username\" LIMIT 1;";//get the whole row
$result=$conn->query($sql);

$row=$result->fetch_assoc();

if(password_verify($password,$row["password"])){//encrypted and put into database with PHP's builtin function, now we verify it by passing it through the same algorithm
  echo "TRUE\n";
}else{
  echo "FALSE\n";
}

?>