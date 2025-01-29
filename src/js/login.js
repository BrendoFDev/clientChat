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
           
        

        const response = await axios.post('http://192.168.0.75:3000/user/login',{
            Email: userEmail.val(),
            Password: userPassword.val()
        },{
            withCredentials:true,
        });
        const socket =  io("http://192.168.0.75:3000", {
            transports: ["websocket"],
            upgrade: false,
            withCredentials: true,
        });
        //socket.emit('connection', {email:userEmail.val(),password:userPassword.val()});
      
        processResponse(response);
    }

    function processResponse(response){
        if(response.status === 200){

            const userData = response.data.user; 
            localStorage.setItem('user', JSON.stringify(userData)); 
          
            window.location.href = '/index'
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