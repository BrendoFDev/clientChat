$(document).ready(function() { 
    const bttjoinRoom = $('#joinRoom');
    
    const socket = io("http://localhost:3000", {
        reconnectionDelayMax: 10000
    });
    
    bttjoinRoom.click((event) => {
        joinRoom();
    });
    
    function joinRoom() {
        const roomName = $('#roomName');
        console.log(roomName.val())
        if (roomName.val()) {  
            socket.emit("join_private_room", { roomId: roomName.val() });
            console.log("tentando entrar na sala: ", roomName.val());
        } else {
            console.log("O nome da sala não pode estar vazio!");
        }
    }
    
    socket.on('joined_in_room', (data) => {
        alert(data.response);
    });
});