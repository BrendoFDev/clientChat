
$(document).ready(function() { 
    const bttjoinRoom = $('#bttJoinRoom');
    const bttSendMessage = $('#bttSendMessage');
    const messageInput = $('#messageInput');
    const messageBox = $('#box_messages');
    const roomName = $('#roomName');
    const token = localStorage.getItem('token');
    const refresh = localStorage.getItem('refresh');
    const currentUser = JSON.parse(localStorage.getItem('user'));
    
    const socket =  io('http://localhost:3000', {
        transports: ["websocket"],
        auth: token
    });
    
    async function authenticateUser() {
        try{
            const response = await axios.post(`http://localhost:3000/access/authenticate`, {
           
            },{
                headers:{
                    token,
                    refresh
                }
            });
            
            console.log(response.data.logged)
            if(!response.data.logged)
                window.location.href = '/login';
            
        }
        catch(error){
            window.location.href = '/login';
        }
    }
   
    authenticateUser();
    
    bttjoinRoom.click((event) => {
        joinRoom();
    });
    
    function joinRoom() {
        
        if (roomName.val()) {  
            socket.emit("join_private_room", { roomId: roomName.val() });
            console.log("tentando entrar na sala: ", roomName.val());
        } else {
            console.log("O nome da sala não pode estar vazio!");
        }
    }
    
    bttSendMessage.click((event)=>{
        event.preventDefault();
        sendMessage();
    });

    function sendMessage(){

        if(messageInput.val() && userName.val())
            socket.emit('private_message', {
                roomId: roomName.val(),
                message: messageInput.val(),
                sender: currentUser.name.val()
            });

        messageInput.val('');

    }

    socket.on('receive_message',(data)=>{
        showMessageInScreen(data.sender, data.message)
    });

    function showMessageInScreen(userName,message){
        messageBox.append(
            `
            <div class="message">
            <div class="sender">
                <label>${userName}</label>
            </div>
            <div class="message_data">
                ${message}
            </div>
            </div>
            `
        );
        console.log('plotado')
    }
});