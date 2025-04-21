jQuery(function () {
    const photoBox = $('.photo_box');
    const bttChangePhoto = $('#changePhoto');
    const bttRemovePhoto = $('#removePhoto');

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
        if (!$('.box_front_body').is(':visible')) {
            $('.box_front_body').show();
        }
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

});