
window.onerror = function (msg, url, lineNo, columnNo, error) 
{
    alert('found error:'+msg);
    alert('found error:'+url);
    alert('found error:'+lineNo);
    //alert('found error:'+error);
    //alert(myGame.questions.current_answer1.name+'-'+myGame.questions.current_answer2.name+'-'+myGame.questions.current_answer3.name+'-'+myGame.questions.current_answer4.name);
    
};



let number1=0,number2=0,number3=0;
let functionList=new Array();
let nextID=0;
function get_nextID(){
	nextID++;
	return nextID;
}

function remove_element_by_id(_id){
	document.getElementById(_id).remove();
}

function add_message_1(_title,_content,_buttonText,_time,_fc1){
	number1++;
	this.add_message("message_1",_title,_content,_buttonText,_time,_fc1,"blue");
	document.getElementById("number1").innerHTML=number1;
}

function add_message_2(_title,_content,_buttonText,_time,_fc1){
	functionList.push(_fc1);
	const _id1=functionList.length-1;
	const _id2=get_nextID();
	const _div_id="div"+_id2;
	let _html=`
		<div id="`+_div_id+`" class="task blue">
              <h3>`+_title+`</h3>
              <p>`+_content+`</p>
              <span class="task-time">
                `+_time+`
              </span>
              <button onclick="functionList[`+_id1+`]()" class="btn done">`+_buttonText+`</button>
              <button onclick="remove_element_by_id('`+_div_id+`')" class="btn delete">delete</button>
        </div>
	`;
	document.getElementById("message_2").innerHTML+=_html;
}

function add_message_3(_title,_content,_buttonText,_time,_fc1){
	functionList.push(_fc1);
	const _id1=functionList.length-1;
	const _id2=get_nextID();
	const _div_id="div"+_id2;
	let _html=`
		<div id="`+_div_id+`" class="task orange">
              <h3>`+_title+`</h3>
              <p>`+_content+`</p>
              <span class="task-time">
                `+_time+`
              </span>
              <button onclick="functionList[`+_id1+`]()" class="btn done">`+_buttonText+`</button>
              <button onclick="remove_element_by_id('`+_div_id+`')" class="btn delete">delete</button>
        </div>
	`;
	document.getElementById("message_3").innerHTML+=_html;
}

function add_message(_id,_title,_content,_buttonText,_time,_fc1,_color){
	functionList.push(_fc1);
	const _id1=functionList.length-1;
	const _id2=get_nextID();
	const _div_id="div"+_id2;
	let _html=`
		<div id="`+_div_id+`" class="task `+_color+`">
              <h3>`+_title+`</h3>
              <p>`+_content+`</p>
              <span class="task-time">
                `+_time+`
              </span>
              <button onclick="remove_element_by_id('`+_div_id+`');functionList[`+_id1+`]()" class="btn done">`+_buttonText+`</button>
              <button onclick="remove_element_by_id('`+_div_id+`')" class="btn delete">delete</button>
        </div>
	`;
	document.getElementById(_id).innerHTML+=_html;
}

/*
let content="has been discovered a large meteorite containing many ores, metals and gems";
add_message_3("New Planet Found",content,"Go","15:1",function(){
	alert("11");
});
*/