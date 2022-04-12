
// 获取最近访问网址的array
function buildNewtabDom(mostVisitedURLs) {
  var newtabDiv = document.getElementById('most_visited_grid');

  for (var i = 0; i < mostVisitedURLs.length; i++) {

    var div = newtabDiv.appendChild(document.createElement('div'));
    div.setAttribute("class", "column");

    var a_column = div.appendChild(document.createElement('a'));
    a_column.setAttribute("class", "most_visited_column");
    a_column.setAttribute("id", "most_visited_column_" + i);
    a_column.href = mostVisitedURLs[i].url;
    // console.log(mostVisitedURLs[i].url)
    a_column.target = "_self";

    var div_column_blank = a_column.appendChild(document.createElement('div'));
    div_column_blank.setAttribute("class", "div_column_blank");


    var div_column_content = a_column.appendChild(document.createElement('div'));
    div_column_content.setAttribute("class", "div_column_content");
    
    var div_column_content_img = div_column_content.appendChild(document.createElement('div'));
    div_column_content_img.setAttribute("class", "div_column_content_img");
    
    var img = div_column_content_img.appendChild(document.createElement('img'));
    img.setAttribute("class", "most_visited_img");
    img.draggable = false;
    img.src = mostVisitedURLs[i].url.split('/')[0] + mostVisitedURLs[i].url.split('/')[1] + mostVisitedURLs[i].url.split('/')[2] + '/favicon.ico';


    var div_p = div_column_content.appendChild(document.createElement('div'));
    div_p.setAttribute("class", "most_visited_div_p");
    // a.href = mostVisitedURLs[i].url;
    // a.target = "_self";

    div_p.appendChild(document.createTextNode(mostVisitedURLs[i].title));
    // a.addEventListener('click', onAnchorClick);

  }
  setTimeout(function(){window.stop();},500);
}

chrome.topSites.get(buildNewtabDom);

$(function () {
  $('img').bind("error", function () {
    this.src = 'img/A-SOULlogo32.png';
  });
});

//baidu搜索
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

var backgroundImgArray = ['../img/All/MidAutumnFestivalAll.jpg']
backgroundImgArray.push('../img/All/DragonBoatFestivalAll.jpg')
backgroundImgArray.push('../img/All/2022All.jpg')
backgroundImgArray.push('../img/All/ChildrensDayAll1.jpg')
backgroundImgArray.push('../img/All/ChingMingFestivalAll.png')
backgroundImgArray.push('../img/All/ChristmasAll.jpg')
backgroundImgArray.push('../img/All/NewYearAll.jpg')
backgroundImgArray.push('../img/All/NewYearsEveAll.jpg')

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


  // })
})