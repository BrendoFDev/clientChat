jQuery(async function () {
    const bttCloseChangePhoto = $('#closeChangePhoto');
    const bttChangePhoto = $('#bttChangePhoto');
    const photoInput = $('#inputPhoto');

    bttCloseChangePhoto.on('click', () => {
        hideChangePhoto();
        unsetFrontBody();
    });

    function unsetFrontBody() {
        if ($('.box_front_body').is(':visible')) {
            $('.box_front_body').hide();
        }
    }

    function hideChangePhoto() {
        if ($('.box_photo_form').is(':visible')) {
            $('.box_photo_form').hide();
        }
    }

    photoInput.on('change', handleFileSelect);

    function handleFileSelect(e) {
        try {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    $('#photo').css('background-image', `url(${e.target.result})`);
                };
                reader.readAsDataURL(file);
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    bttChangePhoto.on('click', changePhoto);

    async function changePhoto() {
        try {
            const formData = new FormData();
            const file = photoInput[0].files[0];
            const token = localStorage.getItem('token');

            if (!file) {
                alert('Escolha um arquivo antes de salvar');
                return;
            }

            formData.append('userPhoto', file);

            const response = await getWithUrl('/photo/user/update', formData, token);

            if (response.status === 201) {
                const user = response.data;
                localStorage.setItem('user', JSON.stringify(user));
                loadUserPhoto(user.Photo);
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    async function getWithUrl(url, body = {}, auth) {
        return await axios.put(`http://192.168.0.5:3000${url}`, body, { headers: { Authorization: `Bearer ${auth}` } });
    }

    function loadUserPhoto(photo) {
        try {
            const imageUrl = `http://192.168.0.5:3000/images/user/${encodeURIComponent(photo.fileName)}`;
            $('#UserOptions').css('background-image', `url(${imageUrl})`);
            $('.photo').css('background-image', `url(${imageUrl})`);
        }
        catch (err) {
            console.log(err);
        }
    }

});