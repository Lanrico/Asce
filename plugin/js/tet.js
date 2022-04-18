//var html = document.body.innerHTML;

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "hello") {
      var title = document.getElementsByClassName("video-title");
      sendResponse("ok");
      console.log(title);
    }
    else
      sendResponse("null");
  });
