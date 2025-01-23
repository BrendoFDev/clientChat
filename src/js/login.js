$(document).ready(function(){

    axios.defaults.withCredentials = true;

    const userEmail = $('#userEmail');
    const userPassword = $('#userPassword');
    const bttLogin = $('#bttLogin');
    const bttLogon = $('#bttLogon');

    bttLogin.click(async (event)=>{
        event.preventDefault();
        await login();
    });

    async function login(){
        const response = await axios.post('http://192.168.0.75:3001/user/login',{
            Email: userEmail.val(),
            Password: userPassword.val()
        });

        processResponse(response);
    }

    function processResponse(response){
        if(response.status === 200){
            window.location.href = '/index';
        }
        else
        {
            alert("Senha ou usuário estão incorretos!");
        }
    }

    bttLogon.click((event)=>{
        window.location.href = '/caduser';
    })

});