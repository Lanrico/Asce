async function getCurrentTab() {
  let queryOptions = {
    active: true,
    currentWindow: true
  };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

//用户输入评论，激活要注入的js
document.getElementById('addButton').addEventListener('click', async () => {
  var xxx = document.getElementById('input1').value;
  chrome.storage.sync.set({
    "xxx": xxx
  });

  let tab = await getCurrentTab();
  chrome.scripting.executeScript({
    target: {
      tabId: tab.id
    },
    files: ['js/addvideonail.js']
  });
});

//用户移除已有的内容
document.getElementById('removeButton').addEventListener('click', async () => {
  let tab = await getCurrentTab();
  chrome.scripting.executeScript({
    target: {
      tabId: tab.id
    },
    func: remove
    //files: ['JS/remove.js']
  });
});

var btn = document.getElementById("clip");
btn.onclick = function() {
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
      var parse_res5 = /^(?:([a-z]+)\/)([A-Za-z0-9]+)/;
      //alert(result[5]);
      var res5_url = result[5];
      res5 = parse_res5.exec(res5_url);
      if (res5[1] == "video") {
        BV=res5[2];
	chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello", url:BV },function(response) {
			console.log(response);
		});
      } else {
        alert("not a video");
      }
    } else {
      alert("not bilibili");
    }
  });

};
//移除的实现
function remove() {
  // //这是另一版功能，暂不需要用
  // var divA = document.getElementById("divA");
  // if (divA) {
  //     divA.parentNode.removeChild(divA);
  // }
  var divB = document.getElementById("divB");
  if (divB) {
    divB.parentNode.removeChild(divB);
  }
}
