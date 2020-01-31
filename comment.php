<?php
   session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Rob Berger</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
  <link rel="stylesheet" href="stylesheet.css">
  <link rel="icon" type="image/png" href="media/slayericon.ico" />
  <style>
    .commentdiv{
      padding-left:10pt;
      border-left:1px solid black;
      margin-left:10pt;
      margin-right:0px;
      margin-bottom:20pt;
      width:auto;
    }
    .commentdiv p{
      margin-top:10px;
      margin-bottom:0px;
    }
    .commenttext{
      border:1px solid black;
      width:90%;
      margin:0px;
      padding:2pt;
      width:auto;
      height:auto;
    }
    .commenttext p{
      margin:0px;
      padding:0px;
    }
  </style>
</head>
<body>
  <script>
    var reply_id=null;
    //function that sets up a reply text box
    function replyBox(id){
      var replyDiv=document.createElement("div");
      var form=document.createElement("form");
      form.id="reply";
      form.method="post";
      form.action="comment.php";
      var textbox=document.createElement("textarea");
      textbox.name="comment";
      form.appendChild(textbox);
      var reply_id=document.createElement("input");
      reply_id.type="hidden";
      reply_id.name="reply_id";
      reply_id.value=id;
      form.appendChild(reply_id);
      var submit=document.createElement("input");
      submit.type="submit";
      form.appendChild(submit);
      replyDiv.appendChild(form);
      document.getElementById(id).appendChild(replyDiv);
    }
  </script>
  <br />
  <div class="container rounded header">
    <br />
    <p><b>Welcome to the world's worst forum!</b></p>
    <?php
      require 'functions.php';

      $conn=connect();

      if(isset($_SESSION["username"]) && isset($_POST["comment"])){
        $sql="SELECT user_id FROM users WHERE username=?";
        $result=mySQL($conn,$sql,array($_SESSION['username']));
        $user_id=$result->fetch_assoc()['user_id'];
        if(auth($conn,$_SESSION["username"],$_SESSION["password"])){
          echo "<p>Posting comment.</p>";
          if(isset($_POST["reply_id"])){
            $sql="INSERT INTO comments (user_id,title,text,parent_id) VALUES (?,'test',?,?)";
            $result=mySQL($conn,$sql,array($user_id,$_POST["comment"],$_POST["reply_id"]));
          }else{
            $sql="INSERT INTO comments (user_id,title,text) VALUES (?,'test',?)";
            $result=mySQL($conn,$sql,array($user_id,$_POST["comment"]));
          }
          echo $result;
        }else{
          echo "ERROR: authentication failure";
        }
      }else if(isset($_SESSION["username"])){
        echo "<p>Logged in as ".$_SESSION["username"].". Feel free to <a href='rate.php'>post a comment</a>.</p>";
      }else{
        echo "<p>Please <a href='login.php'>log in</a> and <a href='rate.php'>post a comment</a>.</p>";
      }

      /*loading em:
      select * where parent_id=NULL
      for row in that:
        load(row)

      load function:
        (takes row as arg)
        display it
        select * where parent_id=id
        for row in that:
          load(row)
      
      ...should work, right?
      */
      function loadChildren($conn,$comment_id){
        $sql="SELECT users.username AS username,
          comments.id AS id,
          comments.title AS title,
          comments.text AS text
          FROM comments INNER JOIN users ON comments.user_id=users.user_id
          WHERE comments.parent_id=?";
        $result=mySQL($conn,$sql,array($comment_id));
        while($row=$result->fetch_assoc()){
          $id=$row['id'];
          //$title=$row['title'];
          $text=$row['text'];
          echo "<div class='commentdiv' id='".$id."'><p><b>".$row['username']."</b></p>
            <div class='commenttext'><p>".$text."</p></div>
            <button onclick='replyBox(\"".$id."\")'>Reply</button>";
          loadChildren($conn,$id);
          echo "</div>";
        }
      }
      //$sql="SELECT * FROM comments WHERE parent_id IS NULL";
      $sql="SELECT users.username AS username,
        comments.id AS id,
        comments.title AS title,
        comments.text AS text
      FROM comments INNER JOIN users ON comments.user_id=users.user_id
      WHERE comments.parent_id IS NULL";
      $result=mySQL($conn,$sql,array());
      while($row=$result->fetch_assoc()){
        $id=$row['id'];
        $title=$row['title'];
        $text=$row['text'];
        echo "<div class='commentdiv' id='".$id."'><p><b>".$row['username']."</b></p>
          <div class='commenttext'><p>".$text."</p></div>
          <button onclick='replyBox(\"".$id."\")'>Reply</button>";
          //TODO: button to delete or edit if they posted it
        loadChildren($conn,$id);
        echo "</div>";
      }
    ?>
    <!--<div class="commentdiv" id="1">
      <p>username</p>
      <div class="commenttext">
        <p>This is a comment. It's pretty boring at the moment, but I kinda like it.</p>
        </div>
      <button onclick="replyBox('1')">Reply</button>
      <div class="commentdiv" id="3">
        <p>other username</p>
        <div class="commenttext">
          <p>I am replying to you. bitch.</p>
        </div>
        <button onclick="replyBox('3')">Reply</button>
      </div>
    </div>
    <div class="commentdiv" id="2">
      <p>another username</p>
      <div class="commenttext">
        <p>Yet again, useless. But this time, also irrelevant to the ongoing conversation.</p>
      </div>
      <button onclick="replyBox('2')">Reply</button>
    </div>-->
    <p>Yeah, probably not a whole lot to see here yet. You can head back to the <a href="/index.html">main page</a> now if you'd like</p>
  </div>
</body>
</html>
