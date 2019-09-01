<?php
/*
$password="justgonnatypesomelongstuffhereandseewhathappens";
echo "encrypting $password \n";
$hash=password_hash($password,PASSWORD_DEFAULT);
echo "hash is $hash\n";
echo "checking if that is the same password\n";
if(password_verify($password,$hash)){
  echo "yes\n";
}else{
  echo "no\n";
}
*/

/*if(!empty($_POST)){
  $username=$_POST["username"];
  $password=password_hash($_POST["password"],PASSWORD_DEFAULT);//encrypt it using PHP's built-in password encryptor, which should be bcrypt with randomly generated salts that are stored in the string itself
}else{
  echo "TODO: put a form here to submit information to this page. Just go back to the main page for now\n";
  die("no post data\n");
}*/

//temp for testing
$username="rob";
$original_pass="password";
$password=password_hash($original_pass,PASSWORD_DEFAULT);

$dbservername="localhost";
$dbusername="adminguy";
//$dbpassword="p4sSw0rD"; TODO: uncomment after sanatizing inputs...
$dbname="website";
$conn = new mysqli($dbservername,$dbusername,$dbpassword,$dbname);
if($conn->connect_error){
  die("Connection failed: ". $conn->connect_error)."\n";
}

$sql = "SELECT EXISTS(SELECT * FROM users WHERE username=\"$username\");";
if($conn->query($sql)){//if someone with that username is already in the database
  echo "Can't register a new account with that username, it already exists\n";
  //die("unable to create user because of non-unique name\n");
  //temp for testing
  $sql="DELETE FROM users WHERE username=\"$username\";";
  $conn->query($sql);
}

$sql="INSERT INTO users (username,password) VALUES (\"$username\",\"$password\");";
$result = $conn->query($sql);

echo "okay it maybe worked: ";
if($result){
  echo "yup\n";
}else{
  echo "nope \n";
}

$sql="SELECT * FROM users WHERE username=\"$username\" LIMIT 1;";//get the whole row
$result=$conn->query($sql);
if(!$result){
  echo "nothing found :(\n";
  die("yeah fuck you\n");
}
$row=$result->fetch_assoc();
print_r($row);

echo "comparing $password with " . $row["password"] . "\n";

if(password_verify($original_pass,$row["password"])){
  echo "passwords match!\n";
}else{
  echo "passwords don't match?\n";
}


//TODO: check out this https://www.php.net/manual/en/mysqli.query.php and look at the FUCKING return values...