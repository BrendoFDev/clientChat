
$(document).ready(function() { 
    const bttjoinRoom = $('#bttJoinRoom');
    const bttSendMessage = $('#bttSendMessage');
    const userName = $('#userName');
    const messageInput = $('#messageInput');
    const messageBox = $('#box_messages');
    const roomName = $('#roomName');

    const socket =  io("http://192.168.0.75:3000", {
        transports: ["websocket"],
        upgrade: false,
        withCredentials: true,
    });
    
    async function authenticateUser() {
        const response = await axios.post('http://192.168.0.75:3000/acess/authenticate',{
            user: localStorage.getItem('user')
         });
     
         if(response.data.logged === true)
               res.render('index')
         else(response.data.logged == false)
              res.render('login')
    }
   
    
   
    
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
        sender: userName.val()
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