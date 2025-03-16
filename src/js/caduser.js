
$(document).ready(function() { 

    const bttRegister = $('#bttCadastrar');
    const bttBack = $('#bttBack');
    const userEmail = $('#userEmail');
    const userName = $('#userName');
    const userPassword = $('#userPassword');

    bttRegister.click(async (event)=>{
        event.preventDefault();
        await registerNewUser();
    })

    async function registerNewUser(){
        try{
            const request = await axios.post('http://localhost:3000/user/createUser',{
                    name: userName.val(),
                    email: userEmail.val(),
                    password: userPassword.val()
            });

            alert(request.data.message)
            window.location.href = './login'

        }catch(err){
            alert(err.response.data.message)
            clearFields();
        }
    }

    function clearFields(){
        userName.val('');
        userEmail.val('');
        userPassword.val('');
    }

    bttBack.click((event)=>{
        window.location.href = '/login';
    })

});