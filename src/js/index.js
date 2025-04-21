jQuery(function () {
    const bttjoinRoom = $('#bttJoinRoom');
    const bttSendMessage = $('#bttSendMessage');
    const bttNewRoom = $('#bttNewRoom');
    const formNewRoom = $('#box_room');
    const messageInput = $('#messageInput');
    const messageFather = $('#messages');
    const messageSon = $('#box_messages');
    const roomInput = $('#roomName');
    const roomBox = $('#opened_rooms');
    const bttprofile = $('#userProfile');
    const formProfile = $('#box_profile');
    const bttLogOut = $('#logOut');

    // Socket Conection

    let socket = null;

    const currentUser = JSON.parse(localStorage.getItem('user'));
    let currentRoom = null;

    (function connectSocket() {
        socket = io('ws://192.168.0.5:3000', {
            transports: ["websocket"]
        });
    }());

    // User Authentication

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

    // Carregando foto de perfil do usuário

    $(() => loadUserPhoto());

    function loadUserPhoto() {
        try {
            const imageUrl = `http://192.168.0.5:3000/images/${encodeURIComponent(currentUser.photo)}`;
            if (currentUser?.photo) {
                $('#UserOptions').css('background-image', `url(${imageUrl})`);
                $('.photo').css('background-image', `url(${imageUrl})`);
            } else {
                console.warn('Usuário sem foto definida.');
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    //-----------------------------------
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

    async function fetchWithAuth(url, body = {}, auth) {
        return await axios.post(`http://192.168.0.5:3000${url}`, body, { headers: { Authorization: `Bearer ${auth}` } });
    }

    function handleLoginRedirect() {
        window.location.href = '/login'
    }

    // Interactivity

    bttjoinRoom.on("click", joinRoom);

    function joinRoom() {
        const roomName = roomInput.val().trim();
        const userId = currentUser.id;
        if (!roomName) return alert("O nome da sala não pode estar vazio!");

        socket.emit("join_private_room", { roomName: roomName, userId });
        roomInput.val('');
    }

    socket.on("joined_in_room", (message) => {
        showJoinRoom(message);
        toggleNewRoomForm();
        loadJoinedRooms();
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
        messageSon.append(messageElement);
    }

    socket.on("connect", () => {
        loadJoinedRooms()
    });

    function loadJoinedRooms() {
        socket.emit("restore_rooms", currentUser.id);
    }

    socket.on("joined_rooms", (rooms) => {
        roomBox.find('.room').detach();
        rooms.forEach((room) => setRoom(room))
    });

    function setRoom(data) {
        const room = $(`
            <div class="room" id="room">
                <span class=roomName></span>
                <span class="roomId"></span>
            </div>
        `);

        room.find('span.roomName').text(data.name);
        room.find('span.roomId').text(data.id);
        roomBox.append(room);
    }

    roomBox.on('click', '.room', (e) => {
        const roomId = $(e.target).closest('.room').find('span.roomId').text();
        const roomName = $(e.target).closest('.room').find('span.roomName').text();
        $('.roomTitle span').text(roomName);

        showRoomName();
        hideUserProfile();

        currentRoom = roomId;
        socket.emit('load_room_messages', roomId);
        showMessageBox();
    });

    function showRoomName() {
        console.log()
        if (!$('.roomTitle span').is(':visible')) {
            $('.roomTitle span').show();
        }
    }

    function hideRoomName() {
        if ($('.roomTitle span').is(':visible')) {
            $('.roomTitle span').hide();
        }
    }

    socket.on('return_room_messages', (data) => {
        messageSon.find('.message').detach();
        data.forEach((message) => showMessageInScreen(message));
        scrollToBottom();
    });

    function showMessageBox() {
        if (!messageFather.is(':visible')) {
            messageFather.show();
        }
    }

    function hiddeMessageBox() {
        if (messageFather.is(':visible')) {
            messageFather.hide();
        }
    }

    function scrollToBottom() {
        messageSon.scrollTop(messageSon[0].scrollHeight);
    }

    messageInput.on('keydown', (e) => { if (e.key == "Enter") sendMessage(e) });

    bttSendMessage.on("click", sendMessage);

    function sendMessage(e) {
        try {

            e.preventDefault();

            let message = messageInput.val().trim();
            let roomId = currentRoom;

            if (message && currentUser && roomId)
                socket.emit('private_message', { roomId, message, currentUser });

            messageInput.val('');
        }
        catch (err) {
            console.log(err);
        }
    }

    socket.on('receive_message', (data) => {
        try {
            console.log(data)
            showMessageInScreen(data)
        }
        catch (err) {
            console.log(err);
        }
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
        messageElement.find('div.sender span').text(data.senderName);
        messageElement.find('div.message_data .content span').text(data.message);
        messageElement.find('div.message_data .content .time span').text(data.time);

        messageSon.append(messageElement)
        scrollToBottom();
    }


    bttNewRoom.on('click', toggleNewRoomForm);

    function toggleNewRoomForm() {
        if (formNewRoom.is(':visible')) {

            formNewRoom.css('animation', 'fadeOutRoomForm 0.3s ease forwards');
            setTimeout(function () {
                formNewRoom.hide();
            }, 300);

        } else {

            formNewRoom.show();
            formNewRoom.css('animation', 'fadeInRoomForm 0.3s ease');
        }
    }

    $('.UserOptions').on("click", function () {
        $(this).next('.options').toggle();
    });

    $(document).on("click", function (e) {
        var target = e.target;
        if (!$(target).is('.UserOptions') && !$(target).parents().is('.UserOptions')) {
            $('.options').hide();
        }
    });

    bttLogOut.on('click', logOut);

    function logOut() {
        localStorage.clear();
        window.location.href = '../login'
    }

    bttprofile.on("click", showUserInfo);

    async function showUserInfo() {
        hiddeMessageBox();
        hideRoomName();
        showUserProfile();
        setUserInfo();
    }

    function setUserInfo() {
        const userName = $('.box_form_profile #name');
        const userEmail = $('.box_form_profile #email');

        userName.val(currentUser.name);
        userEmail.val(currentUser.email);
    }

    function showUserProfile() { if (!formProfile.is(':visible')) formProfile.show(); }
    function hideUserProfile() { if (formProfile.is(':visible')) formProfile.hide(); }

});

