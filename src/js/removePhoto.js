jQuery(function () {
    const bttCloseRemovePhoto = $('#closeRemovePhoto');
    const bttYes = $('#bttYes');
    const bttNo = $('#bttNo');

    bttCloseRemovePhoto.on('click', () => {
        hideRemovePhoto();
        unsetFrontBody();
    });

    function unsetFrontBody() {
        if ($('.box_front_body').is(':visible')) {
            $('.box_front_body').hide();
        }
    }

    function hideRemovePhoto() {
        if ($('.box_remove_photo').is(':visible')) {
            $('.box_remove_photo').hide();
        }
    }

    bttNo.on('click', () => {
        hideRemovePhoto();
        unsetFrontBody();
    });

    bttYes.on('click', handleRemoveClick);

    async function handleRemoveClick() {
        try {
            const url = "/photo/user/delete";
            const token = localStorage.getItem('token');

            const response = await deleteWithUrl(url, token);

            if (response.status === 200) {
                localStorage.removeItem('photo');

                removeUserPhoto();
                hideRemovePhoto();
                unsetFrontBody();
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    function removeUserPhoto() {
        try {
            $('#UserOptions').css('background-image', `none`);
            $('.photo').css('background-image', `none`);
        }
        catch (err) {
            console.log(err);
        }
    }

    async function deleteWithUrl(url, auth) {
        return await axios.delete(`http://192.168.0.5:3000${url}`, { headers: { Authorization: `Bearer ${auth}` } });
    }

});