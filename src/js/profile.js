jQuery(function () {
    const photoBox = $('.photo_box');
    const bttChangePhoto = $('#changePhoto');
    const bttRemovePhoto = $('#removePhoto');
    const bttSaveInfo = $('#bttSaveInfo');

    photoBox.on("click", function (e) {
        $(this).next('.photo_options').toggle();
    });

    $(document).on("click", function (e) {
        var target = e.target;
        if (!$(target).is('.camera_icon') && !$(target).parents().is('.camera_icon')) {
            $('.photo_options').hide();
        }
    });

    bttChangePhoto.on('click', () => {
        setFrontBody();
        showChangePhotoForm();
    });

    bttRemovePhoto.on('click', () => {
        setFrontBody();
        showRemovePhotoForm();
    });

    function setFrontBody() {
        if (!$('.box_front_body').is(':visible'))
            $('.box_front_body').show();

    }

    function showChangePhotoForm() {
        if (!$('.box_photo_form').is(':visible')) {
            $('.box_photo_form').show();
        }
    }

    function showRemovePhotoForm() {
        if (!$('.box_remove_photo').is(':visible')) {
            $('.box_remove_photo').show();
        }
    }

    bttSaveInfo.on('click', saveUserInfo);

    async function saveUserInfo() {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = localStorage.getItem('token');
            const userName = $('#name').val().trim();

            if (user.name != userName)
                user.name = userName;

            const response = await putWithAuth('/user/updateUser', user, token);

            handleSaveResponse(response);
        }
        catch (error) {
            console.error("Error saving user info:", error);
        }
    }

    async function putWithAuth(url, body = {}, auth) {
        return await axios.put(`http://192.168.0.5:3000${url}`, body, { headers: { Authorization: `Bearer ${auth}` } });
    }

    function handleSaveResponse(response) {
        if (response.status === 200) {
            console.log(response)
            localStorage.setItem('user', JSON.stringify(response.data.user));
            alert("Dados atualizados com sucesso!");
        } else
            alert("Não foi possível atualizar os dados!");
    }

});