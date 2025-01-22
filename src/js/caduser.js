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
            const response = await axios.post('http://192.168.0.75:3001/user/createUser',{
                    Name: userName.val(),
                    Email: userEmail.val(),
                    Password: userPassword.val()
            });

           processResponse(response);

        }catch(error){
            console.log("erro ocorreu");
        }
    }

    function processResponse(response){
        if(response.status === 200){
            alert(response.data.message)
            window.location.href = './login'
        }
        if(response.status === 201){
            alert(response.data.message)
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