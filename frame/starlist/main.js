let system_list=new Array();
let ship_position=null;//vi tri hien tai cua player ship

function set_ship_position(x){
	ship_position=x;
}
function set_system_list(_tlist){
	system_list=shuffle_array(_tlist);//alert(system_list.length);
	openGUI('planet-list');
};
let select_star_system_fc=function(){};
let _click_system=null;
function set_select_star_system_fc(_fc){
	select_star_system_fc=_fc;
};
function get_select_system(){
	return _click_system;
};
function get_select_system_id(){
	return _click_system[0];
};
function get_select_system_name(){
	return _click_system[1];
};
function get_select_system_position(){
	return _click_system[2];
};

function shuffle_array(array)
{
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const generateRandomNumber = (from, to) => from + Math.floor(Math.random() * (to - from + 1)),
distance = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
Array.prototype.random = function() {
	return this[generateRandomNumber(0, this.length - 1)];
};
Math.toDegrees = rad => rad * 180 / Math.PI;
Math.toRadians = deg => deg / 180 * Math.PI;
var GUI = {
	"backpack": {
		open(elm) {
			GUI["backpack"].list = elm.querySelector("#backpack-gem-list");
			elm.querySelector(".bp-max-size").innerText = data.backpack.maxSize.toLocaleString("en-US");
			elm.querySelector(".bp-up-cost").innerText = (data.backpack.maxSize * 20000).toLocaleString("en-US");
			for (var gem of Object.keys(data.backpack.items)) {
				var li = document.createElement("li"), path = gem.split(":"), elm;
				elm = generatePlanetGemImage(data.worlds[path[0]][path[1]].gem);
				elm.style.width = "32px";
				li.appendChild(elm);
				li.appendChild(document.createTextNode(data.worlds[path[0]][path[1]].gem.name
				+ " ($" + data.worlds[path[0]][path[1]].gem.value.toLocaleString("en-US") + ") x"));
				elm = document.createElement("span");
				elm.className = "gem-amount";
				li.appendChild(elm);
				li.setAttribute("gem", gem);
				GUI["backpack"].list.appendChild(li);
			}
			GUI["backpack"].interval = setInterval(() => {
				for (var elm of GUI["backpack"].list.querySelectorAll("li")) {
					elm.querySelector(".gem-amount").innerText = data.backpack.items[elm.getAttribute("gem")];
				}
			}, 50);
		},
		close() {
			clearInterval(GUI["backpack"].interval);
			GUI["backpack"].list.innerHTML = "";
			delete GUI["backpack"].list;
			delete GUI["backpack"].interval;
		},
		shortcut: {key: "b"}
	},
	"planet": {
		open(elm, planet) {
			var path = planet.split(":");
			planet = data.worlds[path[0]][path[1]];
			elm.querySelector(".gui-title").innerHTML
			= elm.querySelector(".gui-title").innerHTML.replace(/^(.*?)</, planet.name + "<");
			switch (planet.ownedBy) {
				case null:
				elm.querySelector(".planet-status").innerText = "This planet is independent.";
				if (planet.intelligentLife) {
					elm.querySelector(".planet-status").innerText = "This planet is colonized by intelligent life.";
				}
				elm.querySelector(".options").innerHTML = `
					<div class="gui gui-button" onclick='colonizePlanet(${JSON.stringify(path.join(":"))})'>Colonize
					$${(data.worlds[path[0]][path[1]].size * 1000000
					+ (data.worlds[path[0]][path[1]].intelligentLife ? 1000000 : 0)).toLocaleString("en-US")}</div>
				`;
				break;
				case "You":
				elm.querySelector(".planet-status").innerText = "This is your planet.";
				if (!planet.hasGemProduction) {
					elm.querySelector(".options").innerHTML = `
						<div class="gui gui-button" onclick='setUpGemProduction(${JSON.stringify(path.join(":"))})'>
						Set up gem production ($${(planet.gem.value * 100).toLocaleString("en-US")})
						</div>
					`;
				}
				else {
					elm.querySelector(".options").innerHTML = `
						<div class="gui gui-button" disabled>Set up gem production</div>
					`;
				}
				break;
				default:
				elm.querySelector(".planet-status").innerText = `This planet is a part of the ${planet.ownedBy}'s federation.`;
				elm.querySelector(".options").innerHTML = `
					<div class="gui gui-button" onclick='declareWar(${JSON.stringify(path.join(":"))})'>Declare war
					($${planet.strength.toLocaleString("en-US")})</div>
				`;
				break;
			}
		}
	},
	"alert": {
		open(elm, text) {
			elm.querySelector(".message").innerText = text;
		}
	},
	"confirm": {
		async open(elm, text, onConfirmCallback) {
			elm.querySelector(".message").innerText = text;
			elm.querySelector(".confirm").onclick = (...args) => {
				closeGUI("confirm");
				onConfirmCallback(...args);
			}
		}
	},
	"options": {
		open(elm) {
			elm.querySelector(".volume-setting").value = music.volume * 100;
		},
		changeVolume(value) {
			music.volume = value / 100;
			gameSettings.volume = value;
			saveGameSettings();
		},
		shortcut: {key: "escape"}
	},
	"planet-list": {
		open(elm) {
			var list = elm.querySelector(".planet-list");
			list.innerHTML = "";
			for (var i = 0; i < 1; i++) {
				var li = document.createElement("li");
				list.appendChild(li);
				li.innerHTML = `GalaxyName <ul></ul>`;
				li = li.querySelector("ul");
				for (var j = 0; j < system_list.length/100; j++) {
					//var planet = data.worlds[i][j];
					let _system_name=system_list[j][1];
					let _system_id=system_list[j][0];
					let _system_pos=system_list[j][2];
					//ship_position
					var dx = ship_position.x - _system_pos[0];
					var dy = ship_position.y - _system_pos[1];
					var dz = ship_position.z - _system_pos[2];
					
					let _distance=parseInt(Math.sqrt(dx*dx + dy*dy + dz*dz));//khoang cach tu player-ship->star system
					
					li.innerHTML += `
						<li onclick="click_handle(`+j+`);">
							<a>
								`+_system_id+`
							</a>
							<span class="gui-badge">
								`+_system_name+`
							</span>
							<span class="gui-badge" style="magenta">
								`+_distance+`&nbsp;&nbsp; light-years
							</span>
							<span class="gui-badge" style="darkblue">
							(cách bạn `+_distance+` năm ánh sáng)
							</span>
						</li>
					`;
				}
			}
		},
		shortcut: {key: "p"}
	},
	"change-world": {
		open(elm) {
			elm.querySelector("#change-world-number").value = worldNow;
		},
		shortcut: {key: "w"}
	}
};
//onload = () => {
	//openGUI('planet-list');
//}

function openGUI(name, ...data) {
	document.querySelector(`[gui-name="${name}"]`).classList.add("gui-opened");
	if (!GUI[name]) {
		GUI[name] = {};
	}
	GUI[name].opened = true;
	document.body.appendChild(document.querySelector(`[gui-name="${name}"]`));
	return (GUI[name].open || new Function)(document.querySelector(`[gui-name="${name}"]`), ...data);
}
function closeGUI(name, ...data) {
	if (!GUI[name]) {
		GUI[name] = {};
	}
	GUI[name].opened = false;
	document.querySelector(`[gui-name="${name}"]`).classList.remove("gui-opened");
	return (GUI[name].close || new Function)(document.querySelector(`[gui-name="${name}"]`), ...data);
}

function reopenGUI(name) {
	closeGUI(name);
	openGUI(name);
}


function click_handle(_id){
	_click_system=system_list[_id];
	select_star_system_fc();
};
