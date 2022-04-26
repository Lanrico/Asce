// 从chrome获取最近访问网址的array
function buildNewtabDom(mostVisitedURLs) {
  var newtabDiv = document.getElementById('most_visited_grid');

  for (var i = 0; i < mostVisitedURLs.length; i++) {

    //用于semantic的框架的column类
    var div = newtabDiv.appendChild(document.createElement('div'));
    div.setAttribute("class", "column");

    //给每个按钮加上链接
    var a_column = div.appendChild(document.createElement('a'));
    a_column.setAttribute("class", "most_visited_column");
    a_column.setAttribute("id", "most_visited_column_" + i);
    a_column.href = mostVisitedURLs[i].url;
    a_column.target = "_self";

    //空白占位符用于排版
    var div_column_blank = a_column.appendChild(document.createElement('div'));
    div_column_blank.setAttribute("class", "div_column_blank");

    //图片加文字的div用于排版
    var div_column_content = a_column.appendChild(document.createElement('div'));
    div_column_content.setAttribute("class", "div_column_content");

    //图片div用于排版
    var div_column_content_img = div_column_content.appendChild(document.createElement('div'));
    div_column_content_img.setAttribute("class", "div_column_content_img");

    //图标来自于每个网页的母站的/favicon.ico，当无法获取或者获取时长超时时使用asoullogo作为默认图片
    var img = div_column_content_img.appendChild(document.createElement('img'));
    img.setAttribute("class", "most_visited_img");
    img.draggable = false;
    img.src = mostVisitedURLs[i].url.split('/')[0] + mostVisitedURLs[i].url.split('/')[1] + mostVisitedURLs[i].url.split('/')[2] + '/favicon.ico';

    //图片下方文字，文字内容为网页标题
    var div_p = div_column_content.appendChild(document.createElement('div'));
    div_p.setAttribute("class", "most_visited_div_p");
    div_p.appendChild(document.createTextNode(mostVisitedURLs[i].title));
  }
  setTimeout(function () {
    window.stop();
  }, 1000); //使新标签页不会因为网络问题加载太长时间占用网络资源，加载0.5s后停止

}

chrome.topSites.get(buildNewtabDom);

$(function() {
    $('img').bind("error", function() {
        this.src = 'img/A-SOULlogo32.png';
    });
});

//用于控制baidu搜索
function checkHttps() {
    BaiduHttps.useHttps();
};

function baiduWithHttps(formname) {
    var data = BaiduHttps.useHttps();
    if (data.s === 0) {
        return true;
    } else {
        formname.action = 'https://www.baidu.com/baidu' + '?ssl_s=1&ssl_c' + data.ssl_code;
        return true;
    }
};

//轮换背景图片，计划未来压缩插件体量可能换成网络标签，计划实现用户添加图片功能
//图片来自于ASOUL_offical官方weibo
var backgroundImgArray = ['../img/All/MidAutumnFestivalAll.jpg'];
backgroundImgArray.push('../img/All/DragonBoatFestivalAll.jpg');
backgroundImgArray.push('../img/All/2022All.jpg');
backgroundImgArray.push('../img/All/ChildrensDayAll1.jpg');
backgroundImgArray.push('../img/All/ChingMingFestivalAll.png');
backgroundImgArray.push('../img/All/ChristmasAll.jpg');
backgroundImgArray.push('../img/All/NewYearAll.jpg');
backgroundImgArray.push('../img/All/NewYearsEveAll.jpg');

//每次打开新标签页背景图片轮换
$(function changeBackgroundImg() {
  // $('#switch').click(function () {
  chrome.storage.sync.get('backgroundImgCount', function (nextImg) {
    var count = 0;
    if (nextImg.backgroundImgCount > -1) {
      count = nextImg.backgroundImgCount;
      $('body').css('background-image', 'url(' + backgroundImgArray[nextImg.backgroundImgCount] + ')');
    }
    if (count >= backgroundImgArray.length - 1) {
      chrome.storage.sync.set({
        'backgroundImgCount': 0
      });
    } else {
      chrome.storage.sync.set({
        'backgroundImgCount': count + 1
      });
    }
  });
});

// 以下为设置界面脚本

function changeButtonStatus(button_div) {
  var button_class = button_div.className;
  if (button_class == 'ui slider checkbox checked') {
    button_div.children[1].innerText = '开启';
  } else {
    button_div.children[1].innerText = '关闭';
  }
};

function changeInputByStorage(page, name, status) {
  //chechbox类型的初始化
  var checkbox = document.getElementById('checkbox_' + page + '_' + name);
  if (status == true) {
    checkbox.children[0].checked = true;
    checkbox.className = 'ui slider checkbox checked';
    changeButtonStatus(checkbox);
  }
}

function configPageStorageGet(pageName, defaultOption) {
  var optionList = [];
  for (var key in defaultOption) {
    optionList.push(key);
  }
  chrome.storage.sync.get(optionList, function (main) {
    if (main[optionList[0]] == undefined) {
      chrome.storage.sync.set(defaultOption);
      for (let i = 0; i < optionList.length; i++) {
        changeInputByStorage(pageName, optionList[i], defaultOption[optionList[i]]);
      }
    } else {
      for (let i = 0; i < optionList.length; i++) {
        changeInputByStorage(pageName, optionList[i], main[optionList[i]]);
      }
    }
  });
};

function configPageStorageSet(pageName) {
  var inputList = document.getElementById('secondary_grid_' + pageName).getElementsByTagName('input');
  var inputDictionary = {};
  for (let i = 0; i < inputList.length; i++) {
    if (inputList[i].type == 'checkbox') {
      inputDictionary[inputList[i].parentElement.id.split('_')[2]] = inputList[i].checked;
    }
  }
  chrome.storage.sync.set(inputDictionary);
}

function initialNewtab() {
  chrome.storage.sync.get(['checkLiveTime', 'achievement', 'favorites', 'live2D'], function (status) {
    if (status.checkLiveTime == true) {
      document.getElementById('liveTime_navi').setAttribute('style', 'display: flex;')
    }
    if (status.achievement == true) {
      document.getElementById('achievement_navi').setAttribute('style', 'display: flex;')
    }
    if (status.favorites == true) {
      document.getElementById('favorites_navi').setAttribute('style', 'display: flex;')
    }
    if (status.live2D == true) {
      console.log(document.getElementById('live2D_container'));
      document.getElementById('live2D_container').setAttribute('style', 'display: block;')
    }
  })
}

$(function () {
  configPageStorageGet('main', {
    'videoMark': true,
    'checkLiveTime': true,
    'liveReminder': true,
    'achievement': true,
    'favorites': true,
    'live2D': true
  });
  initialNewtab();
});

$(function () {
  $('.checkbox').click(function () {
    changeButtonStatus(this);
  });

  $('#main_submit').click(function () {
    configPageStorageSet('main');
  });
});

$("#setting_save").on("click", function() {
    console.log("option in button")
    option.showTip = $("#setting_showTip")[0].checked;
    option.TipTime = $("#setting_TipTime")[0].value;

    chrome.storage.sync.set({ 'option': option }, function() {
        console.log(option)
    })
})

var saveSettings = function() {
    option.showTip = $("#setting_showTip")[0].checked;
    option.TipTime = $("#setting_TipTime")[0].value;

    chrome.storage.sync.set({ 'option': option }, function() {
        console.log(option)
    })
}

$("#setting_save").on("click", function() {
    console.log("option in button")
    option.showTip = $("#setting_showTip")[0].checked;
    option.TipTime = $("#setting_TipTime")[0].value;

    chrome.storage.sync.set({ 'option': option }, function() {
        console.log(option)
    })
})

var option = {
    showTip: true,
    TipTime: 10
}

