window.onload=function(){
    var inputEmail=document.getElementById('input-email');
    var inputPassword=document.getElementById('input-password');
    var labelEmail=document.getElementById('label-email');
    var labelPassword=document.getElementById('label-password');
    var btnLogin=document.getElementById('button-login');
    var btnRegister=document.getElementById('button-register');

    btnLogin.addEventListener('click',function(){
        if(!inputEmail.value){
            labelEmail.textContent='Please enter email';
            return;
        }else{
            labelEmail.textContent='';
        }

        if(!inputPassword.value){
            labelPassword.textContent='Please enter password';
            return;
        }else{
            labelPassword.textContent='';
        }

        var http = new XMLHttpRequest();
        var url = "/api/user/login";
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

    btnRegister.addEventListener('click',function(){
        redirect('/register');
    });

}