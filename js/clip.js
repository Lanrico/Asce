//var html = document.body.innerHTML;
chrome.storage.sync.get('table', function(result) {
  if (result.table == null) {
    var table = new Array();
    chrome.storage.sync.set({ table: table }, function() {
      console.log("created");
    });
  }
});
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "hello") {
      // get username and bid

      var name = document.getElementsByClassName("username");
      cont = name[0].innerText;

      var getBid = function() {
        origin_bid = name[0].href;
        var parse_bid = /([0-9]+)/;
        bid = parse_bid.exec(origin_bid);
        return bid[1];
      };
      var bid = getBid();

      console.log(bid);

      var tag = 0;
      const asoul_info = [ "672346917", "672353429", "351609538","672328094", "672342685", "672342685"];

      var d_asoul = function() {
        for (var i = 0; i < 7; i++) {
          if (asoul_info[i] == bid) {
            return i+1;
          }
        }
        return 0;
      };
      var is_asoul = d_asoul();

      console.log(is_asoul);

      // get title
      var title = document.getElementsByClassName("video-title");
      tit = title[0].title;

      const clip = { "title": tit, "user": cont, "link": request.url, "asoul": is_asoul, "score":3 };
      const data = JSON.stringify(clip);

      // send response

      sendResponse(data);

      //store

      chrome.storage.sync.get('table', function(result) {
        console.log("get" + result.table);
        tmp = result.table;
        tmp.push(clip);
        console.log(tmp);
        alert("clip success");
        chrome.storage.sync.set({ table: tmp }, function() {
          console.log("succ");
          chrome.storage.sync.get('table', function(result) {
            console.log("get" + result.table);
          });
        });
      });
    }
    else
      sendResponse("null");
  });
