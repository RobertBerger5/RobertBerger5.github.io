<?php
require 'functions.php';

/*$servername="localhost";
$username="adminguy";
$password="p4sSw0rD";
$dbname="website";

$conn=new mysqli($servername,$username,$password,$dbname);*/
$conn=connect();
/*if($conn->connect_error){
  die("Connection failed: ". $conn->connect_error);
}*/

$ip=$_POST["ip"];

//$result=$conn->query("DELETE FROM ratings WHERE ip=$ip");
$result=mySQL($conn,'DELETE FROM ratings WHERE ip= ?',array($ip));
?>