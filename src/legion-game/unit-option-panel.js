
class UnitOptionPanel{
	constructor(params){
		this._game=params.game;
		this._container=document.body;
	}
	init(){
		const _mother_ship_classes=this._game._unitMG.get_all_unit_class_by_type("Mother-Ship");
		let _html=`
		
<div id="unit-option-panel" class="mainDiv">
	<div class="btnDiv" id="btnDiv">
		<button id="naturebtn">Nature</button>
		<button class="animals" id="animalsbtn">Animals</button>
		<button class="neon" id="neonbtn">Neon Images</button>
	</div>
	
	<div class="img_div" id="nature">`;
		
		for(let i=0;i<_mother_ship_classes.length;i++){
			_html+=`<a href="#">
			<img unit_type="Mother-Ship" id="mother-ship-img-`+i+`" class="unit-img" src="https://www.mediafire.com/convkey/12a5/nz7wr35vetassjvzg.jpg" width="150px" height="100px" title="">
			</a>`;
		}
		
	_html+=`
		<button id="ok-btn-1">OK</button>
	</div>

	<div class="imgAnimals_div" id="animals">
		
	</div>

	<div class="imgneon_div" id="neon">
		
	
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

.unit-img{
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
		
		if(this._main_div){
			this._main_div.remove();
		}
		else{
			document.head.appendChild(styleTag);
		}
		
		this._container.innerHTML+=_html;
		
		
		this._main_div=document.getElementById("unit-option-panel");
		
		
		document.getElementById("naturebtn").addEventListener("click",()=>{
			myFunction();
		});
		document.getElementById("animalsbtn").addEventListener("click",()=>{
			MyFunction();
		});
		document.getElementById("neonbtn").addEventListener("click",()=>{
			myfunction();
		});
		
		const _btn1=document.getElementById("ok-btn-1");
		
		const _click_fc=()=>{
			this._main_div.remove();
		};
		_btn1.addEventListener("click",_click_fc);
		
		for(let i=0;i<_mother_ship_classes.length;i++){
			let _img=document.getElementById("mother-ship-img-"+i);
			_img.addEventListener("click",()=>{
				let _id=_img.id.split("mother-ship-img-")[1];
				_id=parseInt(_id);
				const _player_id=this._game._playerID;
				const _pos=this._game._pos_list_1[i];
				const _mother_ship=this._game._unitMG.create_mother_ship(_player_id,1,_pos);
				//_mother_ship.rotate_about_point(_center_pos,new THREE.Vector3(1,0,0),i*_theta);
			});
		}
	}
}

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


function init(_game){
	let _panel=new UnitOptionPanel({game:_game});
	_panel.init();
}