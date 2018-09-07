// Event handlers
chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.contextMenus.create({
  id : "exec",
  title: "実行！！",
  contexts: ["all"],
  type: "normal"
});

/**
 * Handles click on context menu
 *
 * @param {Object} info
 */
function onClickHandler(info) {
  console.log(info);
  alert("実行！!!!");
/*
  var id;

  id = info.menuItemId;

  switch(id) {
      case 'square':
          sendMessage('drawSquare', info);
          break;
      case 'capture':
          captureScreen();
          break;
  }
  */
}

/**
 * Sends a message to script.js
 *
 * @param {String} msgId
 * @param {Object} info
 */
function sendMessage(msgId, info) {
  var objToSend = {
      msgId: msgId,
      data: info
  };

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, objToSend);
  });
}

/**
* Captures a screen and send a message with captured data
*/
function captureScreen() {
  chrome.tabs.captureVisibleTab({format: 'png'}, function (imgData) {
      sendMessage('saveImg', imgData)
  });
}







    var Constants = {
        saveURL: 'http://random/birthday/saveimage.php',
        w: 500,
        h: 500,
        x: 200,
        y: 200
    };
    function cropData(str, coords, callback) {
        var img = new Image();
        
        img.onload = function() {
            var canvas = document.createElement('canvas');
            canvas.width = coords.w;
            canvas.height = coords.h;
        
            var ctx = canvas.getContext('2d');
        
            ctx.drawImage(img, coords.x, coords.y, coords.w, coords.h, 0, 0, coords.w, coords.h);
            
            var fd = new FormData();
            fd.append('image', dataURItoBlob(canvas.toDataURL()));
            
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if ( xhr.readyState == 4 ) {
                    callback();
                }
            }
            
            xhr.open('POST', Constants.saveURL);
            xhr.send(fd);
        };
        
        img.src = str;
    }
    function capture(coords) {
        chrome.tabs.captureVisibleTab(null, {format: "png"}, function(data) {
            cropData(data, coords, function() {
                console.log("Done");
            });
        });
    }
    chrome.browserAction.onClicked.addListener(function() {
        sendMessage({type: 'start-screenshots'});
    });
    chrome.extension.onMessage.addListener(gotMessage);
    function gotMessage(request, sender, sendResponse) {
        if (request.type == "coords")
            capture(request.coords);
        sendResponse({}); // snub them.
    }
    function sendMessage(msg) {
        chrome.tabs.getSelected(null, function(tab) {
          chrome.tabs.sendMessage(tab.id, msg, function(response) {});
        });
    };
    // --
    // Library things
    // --
    function dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs
        var byteString = atob(dataURI.split(',')[1]);
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        // write the ArrayBuffer to a blob, and you're done
        var bb;
        if ( typeof BlobBuilder != 'undefined' )
            bb = new BlobBuilder();
        else
            bb = new WebKitBlobBuilder();
        bb.append(ab);
        return bb.getBlob(mimeString);
    }
