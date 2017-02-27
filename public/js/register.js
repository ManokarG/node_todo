window.onload=function(){
	var inputUsername=document.getElementById('input-username');
	var labelUsername=document.getElementById('label-username');
	var inputEmail=document.getElementById('input-email');
	var labelEmail=document.getElementById('label-email');
	var inputPassword=document.getElementById('input-password');
	var labelPassword=document.getElementById('label-password');
	var inputConfirmPassword=document.getElementById('input-confirm-password');
	var labelConfirmPassword=document.getElementById('label-confirm-password');
	var buttonRegister=document.getElementById('button-register');

	buttonRegister.addEventListener('click',function(){

		if(!inputUsername.value){
			labelUsername.textContent='Please enter username';
			return;
		}
		labelUsername.textContent='';

		if(!inputEmail.value){
			labelEmail.textContent='Please enter email';
			return;
		}
		labelEmail.textContent='';

		if(!inputPassword.value){
			labelPassword.textContent='Please enter password';
			return;
		}
		labelPassword.textContent='';

		if(!inputConfirmPassword.value){
			labelConfirmPassword.textContent='Please enter confirm password';
			return;
		}else if(inputPassword.value!==inputConfirmPassword.value){
			labelConfirmPassword.textContent='Password and confirm does not match';
			return;
		}

		labelConfirmPassword.textContent='';

		var http = new XMLHttpRequest();
        var url = "/api/user";
        var params = "email="+inputEmail.value+"&password="+inputPassword.value;
        http.open("POST", url, true);

//Send the proper header information along with the request
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
                var json=JSON.parse(http.responseText);
                console.log(http.getResponseHeader('token'));
                if(json.status==='success'){
                    redirect('dashboard?auth='+http.getResponseHeader('token'));
                }else{

                }
            }
        }
        http.send(params);
	});
}