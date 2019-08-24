<?php
$servername="localhost";
$username="adminguy";
$password="p4sSw0rD";
$dbname="website";

$ip=$_POST["ip"];

$conn=new mysqli($servername,$username,$password,$dbname);
if($conn->connect_error){
  die("Connection failed: ". $conn->connect_error);
}

$result=$conn->query("DELETE FROM ratings WHERE ip=$ip");