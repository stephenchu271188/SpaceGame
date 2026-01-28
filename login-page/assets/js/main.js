
let Username,Password;



function createForm(type){
	let _title,_btn_text,_btn_click_event;
	let _footer;
	let _label1;
	let _fc_1;
	if(type===1){
		_title=`LOGIN`;
		_btn_text=`LOGIN`;
		_footer=`
			<p class="login__register" onclick="createForm(2)">
               Don't have an account? <a href="#">Register</a>
            </p>
			<p id='login-message'></p>
		`;
		_label1=`
			<div class="login__check">
               <div class="login__check-group">
                  <input type="checkbox" class="login__check-input" id="login-check">
                  <label for="login-check" class="login__check-label">Remember me</label>
               </div>

               <a href="#" class="login__forgot">Forgot Password?</a>
            </div>
		`;
		_btn_click_event=`login()`;
		_fc_1=()=>{
			if(_saved_username!=null&&_saved_password!=null){
				Username.value=_saved_username;
				Password.value=_saved_password;
				//login();
			}
		};
	}
	else{
		_title=`REGISTER`;
		_btn_text=`REGISTER`;
		_footer=`<p id='login-message'></p>`;
		_label1=`
			<div class="login__check" onclick="createForm(1)">
               Have an account?<a href="#" class="login__forgot"> Login</a>
            </div>
		`;
		_btn_click_event=`register()`;
		_fc_1=()=>{};
	}
	
	let _html=`
		<img src="assets/img/bg.jpg" alt="login image" class="login__img">

         <form id="myForm" action="" class="login__form">
            <h1 class="login__title">`+_title+`</h1>

            <div class="login__content">
               <div class="login__box">
                  <i class="ri-user-3-line login__icon"></i>

                  <div class="login__box-input">
                     <input type="text" required class="login__input" id="login-email" placeholder=" ">
                     <label for="login-email" class="login__label">Username</label>
                  </div>
               </div>

               <div class="login__box">
                  <i class="ri-lock-2-line login__icon"></i>

                  <div class="login__box-input">
                     <input type="password" required class="login__input" id="login-pass" placeholder=" ">
                     <label for="login-pass" class="login__label">Password</label>
                     <i class="ri-eye-off-line login__eye" id="login-eye"></i>
                  </div>
               </div>
            </div>

            `+_label1+`

            <button type="submit" onclick="`+_btn_click_event+`" class="login__button"><span>`+_btn_text+`</span></button>
			`
				+_footer+
			`
            
         </form>
	`;
	
	document.getElementById('login-panel').innerHTML=_html;
	document.getElementById("myForm").addEventListener("submit", function(event) {
		event.preventDefault(); // Chặn hành động mặc định (submit + reload trang)
	});
	
	Username=document.getElementById("login-email");
	Password=document.getElementById("login-pass");
	
	_fc_1();
}

let _lock=false;
function login(){
	if(_lock)return;
	const _username=Username.value.trim();
	const _password=Password.value.trim();
	if(validateUsername(_username)&&validatePassword(_password)){
		if(log_success(_username,_password)){
			_lock=true;
			save_account(_username,_password);
			setTimeout(()=>{
				location.href="../home-page/index.html";
			},500);
			
			return;
		}
		else{
			_lock=true;
			createLoadingScreen();
			setTimeout(()=>{
				let _message_box=document.getElementById("login-message");
				_message_box.style.textAlign="center";
				_message_box.style.color="red";
				_message_box.innerHTML="wrong username or password!";
				_lock=false;
				removeLoadingScreen();
			},2500);
			
			return;
		}
		
	}
	
}

let _loadingScreen=null;
function createLoadingScreen(){
	removeLoadingScreen();
	
	_loadingScreen=document.createElement("div");
	_loadingScreen.style.cssText=`
		position:absolute;
		top:0px;
		left:0px;
		width:100%;
		height:100%;
		z-index:9999;
		background-color: rgba(0, 0, 0, 0.9);
		 display: flex;
		justify-content: center; 
		align-items: center;    
	`;
	_loadingScreen.innerHTML=`
		<div class="box">wait...
			<div class="loader-01"></div>
		</div>
	`;
	document.body.appendChild(_loadingScreen);
}
function removeLoadingScreen(){
	if(_loadingScreen!=null){
		_loadingScreen.remove();
		_loadingScreen=null;
	}
		
}

function register(){
	if(_lock)return;
	const _username=Username.value.trim();
	const _password=Password.value.trim();
	if(validateUsername(_username)&&validatePassword(_password)){
		_lock=true;
		createLoadingScreen();
		setTimeout(()=>{
			_lock=false;
			save_account(_username,_password);
			login();
			removeLoadingScreen();
		},3000);
		
		return;
	}
	else{
		_lock=true;
		createLoadingScreen();
			setTimeout(()=>{
				let _message_box=document.getElementById("login-message");
				_message_box.style.textAlign="center";
				_message_box.style.color="red";
				_message_box.innerHTML="Invalid registration information!";
				_lock=false;
				removeLoadingScreen();
			},2500);
		return;
	}
	
}

createForm(1);

/*=============== SHOW HIDDEN - PASSWORD ===============*/
const showHiddenPass = (loginPass, loginEye) =>{
   const input = document.getElementById(loginPass),
         iconEye = document.getElementById(loginEye)

   iconEye.addEventListener('click', () =>{
      // Change password to text
      if(input.type === 'password'){
         // Switch to text
         input.type = 'text'

         // Icon change
         iconEye.classList.add('ri-eye-line')
         iconEye.classList.remove('ri-eye-off-line')
      } else{
         // Change to password
         input.type = 'password'

         // Icon change
         iconEye.classList.remove('ri-eye-line')
         iconEye.classList.add('ri-eye-off-line')
      }
   })
}

showHiddenPass('login-pass','login-eye')