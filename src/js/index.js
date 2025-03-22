$(document).ready(function () {
    const bttjoinRoom = $('#bttJoinRoom');
    const bttSendMessage = $('#bttSendMessage');
    const bttNewRoom = $('#bttNewRoom');
    const formNewRoom = $('#box_room');
    const messageInput = $('#messageInput');
    const messageBox = $('#box_messages');
    const roomName = $('#roomName');
    const roomBox = $('#opened_rooms');
    
    let socket = null;

    const currentUser = JSON.parse(localStorage.getItem('user'));
    let currentRoom = null;

    (function connectSocket(){
        socket = io('http://localhost:3000', {
            transports: ["websocket"]
        });
    }());

    socket.on("connect", () => {
        const email = currentUser.email;
        if (email) {
            loadJoinedRooms(email)
        }
    });

    function loadJoinedRooms(email){
        socket.emit("restore_rooms", email);
    }

    socket.on("joined_rooms", (rooms)=>{
        roomBox.find('.room').detach();
        rooms.forEach((roomId)=>setRoom(roomId))
    });

    function setRoom(roomId){
        const room = $(`
            <div class="room" id="room">
                <span class="roomId"></span>
                <div class="lastMessage">
                    <span></span>
                </div>
            </div>
        `);

        room.find('span.roomId').text(roomId);
        roomBox.append(room);
    }

    roomBox.on('click','.room',(e)=>{
        const roomId = $(e.target).closest('.room').find('span.roomId').text();
        currentRoom = roomId;
        socket.emit('load_room_messages', roomId);
    });

    socket.on('return_room_messages',(data)=>{
        messageBox.find('.message').detach();
        data.forEach((message) => showMessageInScreen(message));
        scrollToBottom();
    });

    function scrollToBottom(){
        messageBox.scrollTop(messageBox[0].scrollHeight);
    }

    (async function authenticateUser() {
        try {
            const token = localStorage.getItem('token');

            if (!token) handleLoginRedirect();

            const response = await fetchWithAuth('/access/authenticate', token);
            
            if (response?.data?.logged) return;

            let newAccessToken = await tryRefreshAccessToken();

            if (!newAccessToken) return handleLoginRedirect();

            localStorage.setItem('token', newAccessToken);
        }
        catch (err) {
            console.log(err);
            handleLoginRedirect();
        }
    }());

    async function tryRefreshAccessToken() {
        try {
            const refresh = localStorage.getItem('refresh');
            if (!refresh) return null

            const response = await fetchWithAuth('/access/refreshToken', refresh);

            return response?.data?.toked || null;

        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async function fetchWithAuth(url, auth) {
        return await axios.post(`http://localhost:3000${url}`, {}, { headers: { Authorization: `Bearer ${auth}` } });
    }

    function handleLoginRedirect() {
        window.location.href = '/login'
    }

    bttjoinRoom.on("click", joinRoom);

    function joinRoom() {
        const roomId = roomName.val().trim();
        const sender = currentUser.name;
        const email = currentUser.email;

        if (!roomId) return alert("O nome da sala não pode estar vazio!");

        socket.emit("join_private_room", { roomId, sender, email});
        roomName.val('');
    }

    socket.on("joined_in_room", (message)=> {
        showJoinRoom(message);
        toggleNewRoomForm();
        const email = currentUser.email;
        loadJoinedRooms(email);
    });

    function showJoinRoom(message) {

        const messageElement = $(`
                <div class="message">
                    <div class="message_data">
                        <span></span>
                    </div>
                </div>
            `
        );

        messageElement.find('div.message_data  span').text(message);
        messageBox.append(messageElement);
    }

    socket.on("room_already_saved", (message)=>{
        alert(message);
        toggleNewRoomForm();
    })

    messageInput.on('keydown', (e)=>{
        if(e.key == "Enter"){
            sendMessage();
        }
    });

    bttSendMessage.on("click",sendMessage);

    function sendMessage() {

        event.preventDefault();
        let message = messageInput.val().trim();
        let sender = currentUser.name;
        let roomId = currentRoom;

        let time = new Date().toLocaleTimeString();
        let date = new Date().toLocaleDateString();

        if ( message && sender && roomId)
            socket.emit('private_message', { roomId, message, sender, date, time});

        messageInput.val('') ;

    }

    socket.on('receive_message', (data) => {
        showMessageInScreen(data)
    });

    function showMessageInScreen(data) {

        const messageElement = $(`
            <div class="message">
                <div class="sender">
                    <span></span>
                </div>
                <div class="message_data">
                    <div class="content" >
                        <span></span>
                        <div class="time">
                        <span></span>
                        </div>
                    </div>
                </div>
            </div>
            `
        );
        messageElement.find('div.sender span').text(data.sender);
        messageElement.find('div.message_data .content span').text(data.message);
        messageElement.find('div.message_data .content .time span').text(data.time);

        messageBox.append(messageElement)
        scrollToBottom();
    }


    bttNewRoom.on('click',toggleNewRoomForm);

    function toggleNewRoomForm(){
        if (formNewRoom.is(':visible')) {
          
            formNewRoom.css('animation', 'fadeOutRoomForm 0.3s ease forwards');
            setTimeout(function() {
                formNewRoom.hide();
            }, 300); 

        } else {
            
            formNewRoom.show();
            formNewRoom.css('animation', 'fadeInRoomForm 0.3s ease');
        }
    }

});

