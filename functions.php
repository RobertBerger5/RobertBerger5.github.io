<?php
function connect(){
  $dbservername="localhost";
  //user made on the database that has full priviledges
//to my knowledge, you'd have to be able to SSH into this server to make any use of this knowledge, so I'm good with this info being on GitHub. If you find a way to make SQL queries to my database, please let me know. Don't hack me, thanks in advance :)
  $dbusername="adminguy";
  $dbpassword="p4sSw0rD";
  $dbname="website";
  $conn = new mysqli($dbservername,$dbusername,$dbpassword,$dbname);
  if($conn->connect_error){
    die("Connection failed: ". $conn->connect_error)."<br />";
  }
  return $conn;
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

function auth($conn,$user,$pass){
  $result=mySQL($conn,'SELECT * FROM users WHERE username=? LIMIT 1;',array($user));
  if(!$result){
    return false;
  }
  $row=$result->fetch_assoc();
  //print_r($row);
  
  //echo "comparing $password with " . $row["password"] . "<br />";
  
  if(password_verify($pass,$row["password"])){
    //echo "passwords match!<br />";
    return true;
  }else{
    //echo "passwords don't match?<br />";
    return false;
  }
}
?>