var imgsrc;

chrome.runtime.onMessage.addListener(function (request, response) {
    console.log("ovrlay-content-script!");
    if (request.toggle) {
        imgsrc = request.imgsrc;
        toggleOverlay();
    }
});

var isOverlayHtmlCreated = false;

var $img, $overlay,
    $dropzone,
    $zoomIn,
    $zoomOut,
    defaultSettings = {
        imageScale: 1,
        imageUrl: '',
        visible: false,
        css: {
            opacity: 0.6,
            left: 80,
            top: 40
        }
    },
    settings,
    SETTINGS_LOCAL_STORAGE_KEY = 'settings',
    FILE_UPLOAD_URL = 'http://damirmiladinov.com/ovrlay/';

init();

function init() {
    loadSettings();
    if (settings.visible) {
        toggleOverlay();
    }
}


function toggleOverlay() {

    if (!isOverlayHtmlCreated) {
        createOverlayHtml();
        setScale();
    }
    $overlay.toggle();

    settings.visible = $overlay.is(':visible');

    saveSettings();
}

function createOverlayHtml() {

    loadSettings();

    $img = $('<img class="ovrlay-image">')
        .prop('src', imgsrc /*settings.imageUrl*/)
        .css(settings.css)
        .draggable({
            stop: saveSettings
        });

    $controles = $('<div class="controles" />');

    $zoomIn = $('<a href="#" class="control zoom-in">+</a>')
        .click(zoomIn);

    $zoomOut = $('<a href="#" class="control zoom-out">-</a>')
        .click(zoomOut);

    $opacityInc = $('<a href="#" class="control opacity-inc">Inc</a>')
        .click(opacityInc);

    $opacityDec = $('<a href="#" class="control opacity-dec">Dec</a>')
        .click(opacityDec);


    $dropzoneToggle = $('<a href="#" class="control control-upload">Upload<br>Image</a>')
        .click(toggleDropzone);


    $dropzone = $('<div id="dropzone" class="dropzone" />');

    $controles
        .append($zoomIn, $zoomOut, $dropzoneToggle, $opacityInc, $opacityDec);


    $overlay = $('<div class="ovrlay-wrapper">')
        .append($img)
        .append($controles)
        .append($dropzone)
        .hide()
        .appendTo('body');

    isOverlayHtmlCreated = true;

    //initDropzone();

    $img.prop('src', imgsrc);
    //$dropzone.removeAllFiles();

    settings.css = {
        top: 40,
        left: 80
    }

    $img.css(settings.css);

    settings.imageScale = 1;

    //settings.imageUrl = imageUrl;
    saveSettings();

    $dropzone.hide();

}

function saveSettings() {

    settings.css = $img.css(['top', 'left', 'opacity']);

    LocalStorage.set(SETTINGS_LOCAL_STORAGE_KEY, settings);
}

function loadSettings() {

    settings = LocalStorage.get(SETTINGS_LOCAL_STORAGE_KEY, defaultSettings);

}

function zoomIn(e) {
    e.preventDefault();
    settings.imageScale += 0.05;
    setScale();
}

function setScale() {

    $img.css({
        transform: 'scale(' + settings.imageScale + ')',
        opacity: settings.css.opacity
    });
    saveSettings();

}

function zoomOut(e) {
    e.preventDefault();
    settings.imageScale -= 0.05;
    setScale();
}

function opacityInc(e) {
    e.preventDefault();
    settings.css.opacity = Math.min(1, parseFloat(settings.css.opacity) + 0.05);
    setScale();
}

function opacityDec(e) {
    e.preventDefault();
    settings.css.opacity = Math.max(0.05, settings.css.opacity - 0.05);
    setScale();
}


function initDropzone() {

    var dropzone = new Dropzone('#dropzone', {
        url: FILE_UPLOAD_URL,
        maxFiles: 1,
        uploadMultiple: false,
        paramName: 'file'
    });

    dropzone.on('success', function (file, response) {
        var imageUrl;

        console.log(imgsrc);

        if (response.success) {

            imageUrl = response.data.imageUrl;

            $img.prop('src', imageUrl);
            dropzone.removeAllFiles();

            settings.css = {
                top: 40,
                left: 80
            }

            $img.css(settings.css);

            settings.imageScale = 1;

            settings.imageUrl = imageUrl;
            saveSettings();

            $dropzone.hide();
        }


    })

    dropzone.on('error', function (file, response) {
        alert(response.errorMessage);
        dropzone.removeAllFiles();

    });

}

function toggleDropzone() {
    $dropzone.toggle();
}
