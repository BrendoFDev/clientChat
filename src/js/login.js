
$(document).ready(function(){
    const userEmail = $('#userEmail');
    const userPassword = $('#userPassword');
    const bttLogin = $('#bttLogin');
    const bttLogon = $('#bttLogon');

    bttLogin.click(async (event)=>{
        event.preventDefault();
        await login();
    });

    async function login(){
        try{
                
            const response = await axios.post('http://localhost:3000/user/login',{
                email: userEmail.val(),
                password: userPassword.val()
            });
            
            processResponse(response);
            
        }
        catch(error){
            alert("Email ou senha incorretos!")
        }
    }

    function processResponse(response) {

        if (response.status === 200) {
            const token = response.data.token;
            const refresh = response.data.refresh;

            localStorage.setItem('token', token);
            localStorage.setItem('refresh', refresh);

            window.location.href = '/index'

        }
    }

    bttLogon.click((event)=>{
        window.location.href = '/caduser';
    })

});