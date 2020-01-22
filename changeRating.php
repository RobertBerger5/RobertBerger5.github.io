<?php
require 'functions.php';

/*$servername="localhost";
$username="adminguy";
$password="p4sSw0rD";
$dbname="website";

//$ip=-1062731519;
//$rating=5;

$conn=new mysqli($servername,$username,$password,$dbname);
if($conn->connect_error){
  die("Connection failed: ". $conn->connect_error);
}*/
$conn=connect();

$ip=$_POST["ip"];
$rating=$_POST["rating"];

//$result=$conn->query("UPDATE ratings SET rating=$rating WHERE ip=$ip");
$result=mySQL($conn,'UPDATE ratings SET rating= ? WHERE ip= ?',array($rating,$ip));
//TODO: date should probably change, too
?>