
const container=document.getElementById("container");
	container.innerHTML="";
const slider_list=new Array();

function change_value(_id,_value){//phai dam bao _value truyen vao la so' nguyen
	const _slider=document.getElementById("slider-"+_id);
	_slider.value=_value;
	 var inputEvent = new Event('input');
    _slider.dispatchEvent(inputEvent);
	//alert(_slider);
	//alert(_slider.value);
}
function add_value(_id,_value){//phai dam bao _value truyen vao la so' nguyen
	const _slider=document.getElementById("slider-"+_id);
	const _new_value=parseInt(_slider.value)+_value;
	_slider.value=_new_value;
	 var inputEvent = new Event('input');
    _slider.dispatchEvent(inputEvent);
}


	function init(_infor_list,_fc){
		//let _px=0,_py=0;
		let _w=30;
		let _h=_w;
		let _spc=_w+10;
		for(let i=0;i<_infor_list.length;i++){
			//const _num=_infor_list[i][1];
			const _slider_container=document.createElement("div");
			_slider_container.classList.add("range-slider");
			_slider_container.innerHTML+=`
				 <input disabled id="slider-`+i+`" type="range" orient="vertical" min="0" max="100" />
				 <div class="range-slider__bar"></div>
				 <div class="range-slider__thumb"></div>
			`;
			
			slider_list.push(_slider_container);
			container.appendChild(_slider_container);
			
			const _add_btn=document.createElement("button");
			_add_btn.innerHTML="+";
			_add_btn.style.position="absolute";
			_add_btn.style.top="345px";
			_add_btn.style.left=(6+(i*_spc))+"px";
			container.appendChild(_add_btn);
			let _id=i;
			_add_btn.addEventListener("click",()=>{
				_fc(_id);
			});
		}
		
	
	
		
let app = (() => {

  function updateSlider(element) {
    if (element) {
      let parent = element.parentElement,
      lastValue = parent.getAttribute('data-slider-value');

      if (lastValue === element.value) {
        return; // No value change, no need to update then
      }

      parent.setAttribute('data-slider-value', element.value);
      let $thumb = parent.querySelector('.range-slider__thumb'),
      $bar = parent.querySelector('.range-slider__bar'),
      pct = element.value * ((parent.clientHeight - $thumb.clientHeight) / parent.clientHeight);

      $thumb.style.bottom = `${pct}%`;
      $bar.style.height = `calc(${pct}% + ${$thumb.clientHeight / 2}px)`;
      $thumb.textContent = `${element.value}%`;
    }
  }
  return {
    updateSlider: updateSlider };


})();

(function initAndSetupTheSliders() {
  const inputs = [].slice.call(document.querySelectorAll('.range-slider input'));
  inputs.forEach(input => input.setAttribute('value', '100'));
  inputs.forEach(input => app.updateSlider(input));
  // Cross-browser support where value changes instantly as you drag the handle, therefore two event types.
  inputs.forEach(input => input.addEventListener('input', element => app.updateSlider(input)));
  inputs.forEach(input => input.addEventListener('change', element => app.updateSlider(input)));
})();



	}
