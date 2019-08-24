<?php
$servername="localhost";
$username="adminguy";
$password="p4sSw0rD";
$dbname="website";

$ip=$_POST["ip"];
$rating=$_POST["rating"];
//$ip=-1062731519;
//$rating=5;

$conn=new mysqli($servername,$username,$password,$dbname);
if($conn->connect_error){
  die("Connection failed: ". $conn->connect_error);
}

$result=$conn->query("UPDATE ratings SET rating=$rating WHERE ip=$ip");