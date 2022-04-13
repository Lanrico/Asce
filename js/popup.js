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