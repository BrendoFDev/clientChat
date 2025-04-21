jQuery(function () {
    const bttCloseRemovePhoto = $('#closeRemovePhoto');

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
});