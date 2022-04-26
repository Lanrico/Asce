$('.menu .item').tab();

function initialPopup() {
  chrome.storage.sync.get(['videoMark', 'favorites'], function (status) {
    if (status.videoMark == true) {
      document.getElementById('videoMark_navi').className = 'item active';
      document.getElementById('videoMark_segment').className = 'ui bottom attached tab segment active';
    } else if (status.favorites == true) {
      document.getElementById('favorites_navi').className = 'item active';
      document.getElementById('favorites_segment').className = 'ui bottom attached tab segment active';
    } else {
      document.getElementById('noOne_navi').setAttribute('style', 'display: flex;');
      document.getElementById('noOne_navi').className = 'item active';
    }

    if (status.videoMark == true) {
      document.getElementById('videoMark_navi').setAttribute('style', 'display: flex;');
    } 
    if (status.favorites == true) {
      document.getElementById('favorites_navi').setAttribute('style', 'display: flex;')
    }
  })
}

//获取当前标签页
async function getCurrentTab() {
  let queryOptions = {
    active: true,
    currentWindow: true
  };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function videoMarkScript() {
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
      files: ['js/addvideoMark.js']
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

  //以下为popup中各按钮的事件
  //“第一次使用点击这里”按钮
  $(function () {
    $('#tips').click(function () {
      document.getElementById('videomark_main').setAttribute('style', 'display: none;');
      document.getElementById('videomark_tips').setAttribute('style', 'display: block;');
    });
  });

  //所有“返回”按钮
  $(function () {
    $('.tip2').click(function () {
      document.getElementById('videomark_main').setAttribute('style', 'display: block;');
      document.getElementById('videomark_tips').setAttribute('style', 'display: none;');
      document.getElementById('videomark_tip1').setAttribute('style', 'display: block;');
      document.getElementById('videomark_tip2').setAttribute('style', 'display: none;');
      document.getElementById('videomark_tip3').setAttribute('style', 'display: none;');
    });
  });

  //所有“上一步”按钮
  $(function () {
    $('#videomark_tip2>.ui.buttons>.tip1').click(function () {
      document.getElementById('videomark_tip1').setAttribute('style', 'display: block;');
      document.getElementById('videomark_tip2').setAttribute('style', 'display: none;');
    });
  });

  $(function () {
    $('#videomark_tip3>.ui.buttons>.tip1').click(function () {
      document.getElementById('videomark_tip2').setAttribute('style', 'display: block;');
      document.getElementById('videomark_tip3').setAttribute('style', 'display: none;');
    });
  });

  //所有“下一步”按钮
  $(function () {
    $('#videomark_tip1>.ui.buttons>.tip3').click(function () {
      document.getElementById('videomark_tip2').setAttribute('style', 'display: block;');
      document.getElementById('videomark_tip1').setAttribute('style', 'display: none;');
    });
  });

  $(function () {
    $('#videomark_tip2>.ui.buttons>.tip3').click(function () {
      document.getElementById('videomark_tip3').setAttribute('style', 'display: block;');
      document.getElementById('videomark_tip2').setAttribute('style', 'display: none;');
    });
  });
}

$(function () {
  videoMarkScript();
  initialPopup();
});
