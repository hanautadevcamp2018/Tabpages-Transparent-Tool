

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