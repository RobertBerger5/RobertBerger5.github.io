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

function mySQL($conn,$string,$params){
  if($stmt=$conn->prepare($string)){
    switch(count($params)){
      case 0:
        break;
      case 1:
        $stmt->bind_param('s',$params[0]);
        break;
      case 2:
        $stmt->bind_param('ss',$params[0],$params[1]);
        break;
      case 3:
        $stmt->bind_param('sss',$params[0],$params[1],$params[2]);
        break;
      case 4:
        $stmt->bind_param('ssss',$params[0],$params[1],$params[2],$params[3]);
        break;
      case 5:
        $stmt->bind_param('sssss',$params[0],$params[1],$params[2],$params[3],$params[4]);
        break;
    }

    $stmt->execute();
    return $stmt->get_result();
  }else{
    echo("ERROR: issue preparing the statement");
    return "ERR";
  }
}


//$result=$conn->query("UPDATE ratings SET rating=$rating WHERE ip=$ip");
$result=mySQL($conn,'UPDATE ratings SET rating= ? WHERE ip= ?',array($rating,$ip));
//TODO: date should probably change, too