window.onload=function(){
    var input=document.getElementById('input-forgot');
    var btn=document.getElementById('btn-forgot');
    var label=document.getElementById('label-msg');
    var containerForgot=document.getElementById('forgot-pass');
    var containerMsg=document.getElementById('forgot-pass-success');
    var errorLabel=document.getElementById('error-label');

    btn.addEventListener('click',function(){
        if(input.value){
            errorLabel.innerHTML='';
            var http = new XMLHttpRequest();
            var url = "/api/user/forgotpassword";
            var params = "email="+input.value;
            http.open("POST", url, true);

//Send the proper header information along with the request
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            http.onreadystatechange = function() {//Call a function when the state changes.
                if(http.readyState == 4 && http.status == 200) {
                    var json=JSON.parse(http.responseText);
                    console.log(json);
                    if(json.status==='success'){
                        label.innerHTML=json.message;
                        containerForgot.classList.add('hidden');
                        containerMsg.classList.remove('hidden');
                    }else{
                        errorLabel.innerHTML=json.message;
                    }
                }
            }
            http.send(params);
        }else{
            errorLabel.innerHTML='Please enter email';
        }
    });
};