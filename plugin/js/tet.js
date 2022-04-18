//var html = document.body.innerHTML;

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "hello") {
      var name = document.getElementsByClassName("username");
      sendResponse(name);
      console.log(name);
      //alert(title);
      cont=name[0].innerText;
      console.log(cont);
      alert(cont);
    }
    else
      sendResponse("null");
  });
