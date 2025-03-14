$(document).ready(function () {
    const bttjoinRoom = $('#bttJoinRoom');
    const bttSendMessage = $('#bttSendMessage');
    const messageInput = $('#messageInput');
    const messageBox = $('#box_messages');
    const roomName = $('#roomName');


    const currentUser = JSON.parse(localStorage.getItem('user'));

    const socket = io('http://localhost:3000', {
        transports: ["websocket"],
        auth: token
    });

    (async function authenticateUser() {
        try {

            const token = localStorage.getItem('token');
            if (!token) handleLoginRedirect();
            const response = fetchWithAuth('/access/authenticate', token);

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


    bttjoinRoom.click(joinRoom);

    function joinRoom() {
        const roomId = roomName.val().trim();

        if (!roomId) return alert("O nome da sala não pode estar vazio!");

        socket.emit("join_private_room", { roomId });
    }

    bttSendMessage.click(sendMessage);

    function sendMessage() {

        event.preventDefault();
        let message = messageInput.val().trim();
        let userName = currentUser.name.val();
        let roomId = roomName.val().trim();

        if ( message && userName && roomId)

            socket.emit('private_message', {
                roomId: roomId,
                message: message,
                sender: userName,
            });

        messageInput.val('');

    }

    socket.on('receive_message', (data) => {
        showMessageInScreen(data.sender, data.message)
    });

    function showMessageInScreen(userName, message) {
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