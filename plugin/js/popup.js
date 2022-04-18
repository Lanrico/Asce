var btn = document.getElementById("btn");
btn.onclick = function() {
  // chrome.tabs.getSelected(null, function(tab) {
  //   var tid=tab.id;
  //   alert(tid.url);
  // });
  /* 
     获取当前 tab id url
  */
  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  }, function(tabs) {
    var tab = tabs[0];
    console.log(tab.url);

    /*正则分析该 url*/
    var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
    var url = tab.url;
    result = parse_url.exec(url);
    if (result[3] == "www.bilibili.com") {
      var parse_res5 = /^(?:([a-z]+)\/)([A-Za-z]+)/;
      alert(result[5]);
      var res5_url = result[5];
      res5 = parse_res5.exec(res5_url);
      if (res5[1] == "video") {
        alert("yes!");
        alert(result[1] + result[2] + result[3] + result[5]);

      } else {
        alert("not a video");
      }
    } else {
      alert("not bilibili");
    }
  });

};
var ol = document.getElementById("ol");
ol.onclick = function() {
  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  }, function(tabs) {
    // var tab = tabs[0];
    chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello" },
      function(response) {
        console.log(response);
      });
  });
};
