const authpopup = document.getElementById('authpop');
const maincontent = document.getElementById('maincontent');
var usernameinput = document.getElementById('username');
var passwordinput = document.getElementById('password');
var hostnameinput = document.getElementById('hostname');
var portinput = document.getElementById('portnumber');
var authmessageinput = document.getElementById('authmessage');

function authprompt(){
authpopup.style.display = 'block';
maincontent.style.visibility = 'hidden';
}

function authlistener(msg){
  console.log(msg);

  document.getElementById('submitcredentials').addEventListener('click', function(){

    authmessageinput.innerHTML = "<div style='padding:15px;color:red;font-weight: bold;'>"+msg+"</div>";
    if ((usernameinput.value=='' || passwordinput.value=='') || (hostnameinput.value=='' || portinput.value=='')) {
      authmessageinput.innerHTML = "<div style='padding:15px;color:red;font-weight: bold;'>One or more fields are empty</div>";
    }else{
      localStorage.setItem("username",usernameinput.value);
      localStorage.setItem("password",passwordinput.value);
      localStorage.setItem("hostname",hostnameinput.value);
      localStorage.setItem("port",portinput.value);
      authpopup.style.display = 'none';
      maincontent.style.visibility = 'visible';
      console.log('httpsauth called from authlistener');

      httpsauth();
    }
  })
}
