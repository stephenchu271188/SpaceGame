
class ChildrenShipPanel{
	constructor(params){
		this._game=params.game;
		this._container=params.container;
	}
	init(){
		let _html=`
		
<div class="mainDiv">
	<div class="btnDiv" id="btnDiv">
		<button id="naturebtn">Nature</button>
		<button class="animals" id="animalsbtn">Animals</button>
		<button class="neon" id="neonbtn">Neon Images</button>
	</div>
	
	<div class="img_div" id="nature">
	
		<a href="https://www.mediafire.com/convkey/12a5/nz7wr35vetassjvzg.jpg"><img src="https://www.mediafire.com/convkey/12a5/nz7wr35vetassjvzg.jpg" width="150px" height="100px" title="Forest Trees">
		</a>
	

		<a href="http://www.mediafire.com/convkey/99df/0x04ujsff77qov8zg.jpg"><img src="http://www.mediafire.com/convkey/99df/0x04ujsff77qov8zg.jpg" width="150px" height="100px" title="Green Leaf Tree Under Blue Sky">
		</a>

		
	</div>

	<div class="imgAnimals_div" id="animals">
		<a href="http://www.mediafire.com/convkey/aacc/jkalvn1z9wr66nezg.jpg" class="image"><img src="http://www.mediafire.com/convkey/aacc/jkalvn1z9wr66nezg.jpg" width="150px" height="100px" title="Cute Dog">
		</a>

		<a href="http://www.mediafire.com/convkey/04fb/rzuwtegcbgcm5anzg.jpg"><img src="http://www.mediafire.com/convkey/04fb/rzuwtegcbgcm5anzg.jpg" width="150px" height="100px" title="Brown Animal On Green Grass">
		</a>

		
		</div>

		<div class="imgneon_div" id="neon">
		
		<a href="http://www.mediafire.com/convkey/0ce1/e292q9lf6leuczbzg.jpg"><img src="http://www.mediafire.com/convkey/0ce1/e292q9lf6leuczbzg.jpg" width="150px" height="100px" title="Do What You Love Neon Image">
		</a>
		

		<a href="http://www.mediafire.com/convkey/1d6c/ozq9bwsa8ec3ea2zg.jpg"><img src="http://www.mediafire.com/convkey/1d6c/ozq9bwsa8ec3ea2zg.jpg" width="150px" height="100px" title="Neon Wires">
		</a>

	</div>


</div>

		`;
		
		var styleTag = document.createElement("style");
		styleTag.textContent=`
		

.mainDiv{
	position: absolute;
	top: 5%;
	left: 50%;
	transform: translate(-50%,-50%);
	box-shadow: 0 0 10px 5px skyblue,
				0 0 10px 5px yellow;
	animation: animate 5s infinite;
  margin-top: 250px;
  margin-bottom: 200px;
  

}

@keyframes animate{
	0%{
		box-shadow: 0 0 10px 5px skyblue,
					0 0 10px 5px yellow;
	}

	20%{
		box-shadow: 0 0 10px 5px magenta,
					0 0 10px 5px purple;
	}

	40%{
		box-shadow: 0 0 10px 5px green,
					0 0 10px 5px lightgreen;
	}

	60%{
		box-shadow: 0 0 10px 5px blue,
					0 0 10px 5px lightblue;
	}
	80%{
		box-shadow: 0 0 10px 5px magenta,
					0 0 10px 5px forestgreen;
	}

	100%{
		box-shadow: 0 0 10px 5px green,
					0 0 10px 5px lightgreen;
	}
}


.btnDiv{
	max-width: 100%;
	height: 100%;
	background: rgba(255,0,0,0.1);
	z-index: 0;

	
}

.animals{
	background: green;
}

.animals:hover{
	background: darkgreen;
}


.imgAnimals_div{
	max-width: 100%;
	background: lightgreen;
	background: rgba(130,255,69,0.1);
	display: none;
}


.neon{
	background: blue;
}

.neon:hover{
	background: darkblue;
}

.mainDivOne{
	width: 1000px;
	height: 1500px;
	background: red;
}


.imgneon_div{
	max-width: 100%;
	background: lightgreen;
	background: rgba(14,9,116,0.5);
	display: none;
}
button{
	position: relative;
	background: #FF0000;
	color: #fff;
	padding: 10px;
	font-size: 15px;
	font-family: sans-serif;
	border: none;
	cursor: pointer;
	letter-spacing: 1.8px;
	transition: 0.5s ease;
	text-transform: uppercase;
}

img{
	margin: 10px;
	box-shadow: 0 0 10px red;
}




.image:hover .imgAnimals_div{
	background: green;
}

button:hover{
	background: #B90000;
	transition: 0.5s ease;
	box-shadow: 0 0 10px yellow;
}


.img_div{
	background: rgba(255,0,0,0.5);
	max-width: 100%;
	max-height: 100%;
}

@media only screen and (max-width: 600px) {
	.mainDiv{
		margin-top: 250px;
		width: 350px;
		margin-bottom: 350px;
	}

}
		`;
		
		this._container.innerHTML+=_html;
		document.head.appendChild(styleTag);
		
		
		document.getElementById("naturebtn").addEventListener("click",()=>{
			myFunction();
		});
		document.getElementById("animalsbtn").addEventListener("click",()=>{
			MyFunction();
		});
		document.getElementById("neonbtn").addEventListener("click",()=>{
			myfunction();
		});
		
	}
}
export {ChildrenShipPanel}

function myFunction(){
	document.getElementById("animals").style.display = 'block';
	document.getElementById("nature").style.display = 'none';
	document.getElementById("neon").style.display = 'none';
	document.getElementById("btnDiv").style.background = 'rgba(130,255,59,0.2)';
}

function MyFunction(){
	document.getElementById("animals").style.display = 'none';
	document.getElementById("nature").style.display = 'none';
	document.getElementById("neon").style.display = 'block';
	document.getElementById("btnDiv").style.background = 'rgba(24,18,149,0.1)';
}

function myfunction(){
	document.getElementById("animals").style.display = 'none';
	document.getElementById("nature").style.display = 'block';
	document.getElementById("neon").style.display = 'none';
	document.getElementById("btnDiv").style.background = 'rgba(255,0,0,0.1)';
}