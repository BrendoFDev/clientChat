
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
                
            const response = await axios.post('http://192.168.0.75:3000/user/login',{
                Email: userEmail.val(),
                Password: userPassword.val()
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
            const user = response.data.user;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            window.location.href = '/index'

        }
    }

    bttLogon.click((event)=>{
        window.location.href = '/caduser';
    })

});