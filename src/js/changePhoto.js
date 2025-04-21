jQuery(function () {
    const bttCloseChangePhoto = $('#closeChangePhoto');

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
});