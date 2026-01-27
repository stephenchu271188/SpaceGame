let _saved_username=null;
let _saved_password=null;

_saved_username=localStorage.getItem("space-game-username");
_saved_password=localStorage.getItem("space-game-password");

function save_account(_uname,_pass){
	localStorage.setItem("space-game-username", _uname);
	localStorage.setItem("space-game-password", _pass);
}
function log_success(_name,_pass){
	let _saved_username=localStorage.getItem("space-game-username");
	let _saved_password=localStorage.getItem("space-game-password");
	
	if(_name!=_saved_username||_pass!=_saved_password)
		return false;
	
	return true;
}
function validateUsername(username) {//"Tên đăng nhập phải từ 4-20 ký tự, bắt đầu bằng chữ, chỉ chứa chữ cái, số hoặc dấu gạch dưới."
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{3,19}$/;
    return usernameRegex.test(username);
}

function validatePassword(password) {// phải ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
}
