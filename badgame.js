<!DOCTYPE html>
<html lang="en"><head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, user-scalable=no" />
		<title>Bad Game</title>
		<link href="http://vignette2.wikia.nocookie.net/wowwiki/images/3/3d/UI-Skull-16x16.png/revision/latest?cb=20071229215904" rel="icon" type="image/x-icon" />
		<script src="https://code.jquery.com/jquery-1.10.2.js"></script>
		<style type="text/css">
			body{
				margin:0px;
			}
			#top{
				z-index:2;
				height:100%;
				width:100%;
				position:fixed;
				opacity:.25;
				display:block;
				border:0px;
				padding:0px;
			}
			canvas{
				z-index:1;
				display:block;
				border:0px;
				padding:0px;
			}
			#batman{
				height:100%;
				width:100%;
				display:block;
				border:0px;
				padding:0px;
			}
			input{
				position:fixed;
				bottom:0px;
				left:0px;
				z-index:4;
				height:100%;
				width:100%;
				opacity:.25;
				display:block;
				border:0px;
				padding:0px;
			}
			/*.touchBox{
				background-color:#f00;
				position:fixed;
				z-index:3;
			}
			#leftBox{
				height:100%;
				width:25%;
				left:0px;
			}
			#rightBox{
				height:100%;
				width:25%;
				right:0px;
			}
			#topBox{
				height:25%;
				width:100%;
				top:0px;
			}
			#bottomBox{
				height:25%;
				width:100%;
				bottom:0px;
			}*/
			#youSuck{
				text-align:center;
				font-size:100px;
				color:#f00;
			}
		</style>
	</head>
	<body>
		<div id="top">
			<!--<div class="touchBox" id="leftBox"></div>
			<div class="touchBox" id="rightBox"></div>
			<div class="touchBox" id="topBox"></div>
			<div class="touchBox" id="bottomBox"></div>-->
		</div>
		<canvas height="100px" width="100px">
		<script src="file:///Users/robertberger/Library/Sites/badgame.js"></script>
		<audio loop autoplay src="http://d2436y6oj07al2.cloudfront.net/rfm/previews/Aggressor%20Full-preview.mp3?_=1" id="background"></audio>
		<audio id="monsterDeath"> 
			<source src="http://www.freesound.org/data/previews/87/87535_1380975-lq.mp3" type="audio/mpeg">
		</audio>
		<audio id="scream" src="http://www.freesound.org/data/previews/169/169628_1183243-lq.mp3"></audio>

		<!--Background-->
		<!--<img id="batmanImg" src="http://new1.fjcdn.com/comments/4926493+_2cc448c00af78212dedc0ba31ea4def5.jpg" />
		<audio id="batmanSound" src="http://soundbible.com/mp3/Quick%20Fart-SoundBible.com-655578646.mp3"></audio>-->
		</canvas>
		<!--<input />-->
	</body>
</html>
