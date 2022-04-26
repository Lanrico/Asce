//1，取到评论,并处理
var comment = chrome.storage.sync.get("xxx", function (val) {
  //取到用户输入的评论
  comment = val.xxx;
  timeLength = document.getElementsByClassName('bilibili-player-video')[0].firstChild.duration; //获取视频总长度
  var allTheTimes = getTimes(comment); //获取各个时间
  var allTheComments = getComments(comment); //获取各个语言描述
  // //这是另一版功能，暂不需要用
  // if (!document.getElementById('divA')) {
  //   addContainer();
  //   addSpans(allTheTimes, allTheComments, timeLength);
  //   addFadeInAndOut();
  //   addPopput();
  // }

  if (!document.getElementById('divB')) {
    addDrawBox(allTheTimes);
    addLis(allTheTimes, allTheComments);
  }

});

//这是测试用的
var testCase = "35:36  什么一滴都不剩了？！36:01  全能队长贝拉直播演示如何开肩 37:36  做 贼 心 虚 嘉 晚 39:25  开始同步！然&晚《Mafia In the morning》（练习室版） 44:15  乐:娘子！琳:啊哈！"
var test2 = "  6:01  全能队长贝拉直播演示如何开肩 17:36  做 贼 心 虚 嘉 晚 19:25  开始同步！  "


//初始化弹出框，弹出框的结构如下
function addDrawBox(allTheTimes) {
  //总容器
  var divB = document.createElement('div');
  divB.setAttribute('style', "z-index:10000001;position:absolute;width:10%;height:40%;top:12%;left:150px;");
  divB.setAttribute('id', "divB");
  divB.setAttribute('class', "container mt-3");
  document.getElementsByClassName('bilibili-player-video-control-bottom-left')[0].append(divB);
  //弹出框类
  var dropup = document.createElement('div');
  dropup.setAttribute('id', 'theDropup');
  dropup.setAttribute('class', 'dropup');
  document.getElementById('divB').append(dropup);
  //激活弹出的按钮
  var button1 = document.createElement('button');
  button1.setAttribute('class', 'btn btn-primary dropdown-toggle');
  button1.setAttribute('data-bs-toggle', 'dropdown');
  button1.setAttribute('style', 'text-align: center;color:rgba(255, 255, 255, 0.85);font-size:100%;')
  button1.append(document.createTextNode("视频轴书签"));
  dropup.append(button1);
  //容纳每条弹出内容的容器
  var ul1 = document.createElement('ul');
  ul1.setAttribute('id', "theUl")
  ul1.setAttribute('class', 'dropdown-menu');
  if(allTheTimes.length >= 14){
    ul1.setAttribute('style', "height: 400px; overflow-y: scroll;");
  }
  document.getElementById('theDropup').append(ul1);

}


//初始化弹出框里面的每一条
function addLis(allTheTimes, allTheComments) {
  for (var i = 0; i < allTheTimes.length; i++) {
    var lis = document.createElement('li');
    lis.setAttribute('class', 'liComment');
    var spans = document.createElement('span');
    lis.append(spans);
    spans.setAttribute('class', 'dropdown-item');
    insideStr = produceText(allTheComments[i], allTheTimes[i])
    spans.append(document.createTextNode(insideStr));
    document.getElementById('theUl').append(lis);
    jumpToSomeTime(spans, allTheTimes[i]);
  }
}


//在回添语言描述的时候，再加上对应的时间
function produceText(comment, time) {
  var insideStr = "";
  x = time;
  z = Math.floor(x / 3600); //小时数
  y = x % 3600; //分钟
  y = Math.floor(y / 60); //分钟数
  x = x % 60; //秒数
  if (z != 0) {
    insideStr = z + ":" + y + ":" + x + comment;
  } else {
    insideStr = y + ":" + x + comment;
  }
  return insideStr
}


//设置视频跳转
function jumpToSomeTime(spans, certainTime) {
  spans.addEventListener("click", function () {
    var video = document.getElementsByClassName('bilibili-player-video')[0];
    video.firstChild.currentTime = certainTime;
    video.firstChild.play();
  })
}


// //这是另一版功能，暂不需要用
// function addContainer() {
//   var divA = document.createElement('div');
//   divA.setAttribute('style', "border:3px ;z-index:10000001;position:absolute; bottom:23%;width:100%");
//   divA.setAttribute('id', "divA");
//   divA.setAttribute('class', "container mt-3");
//   document.getElementById('bilibiliPlayer').append(divA);
// }

// //这是另一版功能，暂不需要用
// function addPopput() {
//   var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
//   var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
//     return new bootstrap.Tooltip(tooltipTriggerEl);
//   })
// }

// //这是另一版功能，暂不需要用
// function addSpans(allTheTimes, allTheComments, timeLength) {
//   for (var i = 0; i < allTheTimes.length; i++) {
//     var spans = document.createElement('span');
//     spans.setAttribute('class', 'btn btn-primary');
//     spans.setAttribute('data-bs-toggle', 'tooltip');
//     spans.setAttribute('title', allTheComments[i]);//在这个地方加上弹出的字，也就是字幕
//     var posi = allTheTimes[i] / timeLength * 100;
//     spans.setAttribute('style', "position:absolute;left:" + posi + "%;");//在这个地方加上具体的百分比位置
//     spans.append(document.createTextNode(i));
//     document.getElementById('divA').append(spans);
//     jumpToSomeTime(spans, allTheTimes[i]);
//   }
// }

// //这是另一版功能，暂不需要用
// function addFadeInAndOut() {
//   var dd = document.getElementsByClassName("container mt-3")[0];
//   dd.addEventListener("mouseover", function () { dd.style.opacity = 1 });
//   dd.addEventListener("mouseout", function () { dd.style.opacity = 0.5 });
// }

//用户输入的评论含两部分，时间和对应的语言描述，此为取出时间
function getTimes(str) {
  var reg2 = /\d{1,}:\d{1,}/g;
  var reg3 = /\d{1,}:\d{1,}:\d{1,}/g;
  //先找到所有带小时的，然后逐个替换
  var tempLong = str.match(reg3);
  var Longlist = [];

  if (tempLong) {
    for (var i = 0; i < tempLong.length; i++) {
      var tempStr = tempLong[i].split(":");
      var LongTime = parseInt(tempStr[0]) * 3600 + parseInt(tempStr[1]) * 60 + parseInt(tempStr[2]);
      Longlist.push(LongTime);
    }
  }
  //将时间换算成秒，最后返回一个顺序的，含有秒数的list
  var tempMandS = str.match(reg2);
  var MandSlist = [];
  for (var i = 0; i < tempMandS.length - Longlist.length; i++) {
    tempStr = tempMandS[i].split(":");
    var MTime = parseInt(tempStr[0]) * 60 + parseInt(tempStr[1]);
    MandSlist.push(MTime);
  }
  result = MandSlist.concat(Longlist);
  return result;
}

function getComments(str) {
  //在弄评论之前犁地一遍，评论里也会有冒号，把除了时间里的冒号替换成“-”
  temp = str.split('');
  for (var i = 0; i < temp.length - 2; i++) {
    var x0 = parseInt(temp[i]);
    var x2 = parseInt(temp[i + 2]);
    if ((temp[i + 1] == ":") && (!(/\d/.test(x0)) || !(/\d/.test(x2)))) {
      temp[i + 1] = "-";
    }
  }
  afStr = temp.join('');
  temp2 = afStr.split(':');

  //这个地方加一层判断，如果是时间在前，就要这样处理了，
  if (((afStr[2] == ":") && ((/\d/.test(afStr[1])) || (/\d/.test(afStr[3])))) || ((afStr[1] == ":") && ((/\d/.test(afStr[0])) || (/\d/.test(afStr[2]))))) {
    return dealCom1(temp2);
  } else {
    return dealCom2(temp2);
  }

  //这里其实明显是有bug的，
  //1，文字描述最好是有字的，希望别往里面塞纯时间轴的
  //2, 文字描述不要是长度低于2的纯数字
}

function dealCom1(temp2) {//时间在前的处理方式
  result = [];
  tempResult = [];
  for (var i = 0; i < temp2.length; i++) {
    if ((temp2[i].length <= 2) && (/\d/.test(temp2[i]))) {
    } else {
      tempResult.push(temp2[i]);
    }
  }
  //这是需要的文字描述的集合
  for (var i = 0; i < tempResult.length - 1; i++) {
    result.push(tempResult[i].slice(2, tempResult[i].length - 2));
  }
  result.push(tempResult[tempResult.length - 1].slice(2));
  return result;
}


function dealCom2(temp2) {//时间在后的处理方式
  result = [];
  tempResult = [];
  for (var i = 0; i < temp2.length; i++) {
    if ((temp2[i].length <= 2) && (/\d/.test(temp2[i]))) {
    } else {
      tempResult.push(temp2[i]);
    }
  }
  result.push(tempResult[0].slice(0, tempResult[0].length - 2));
  for (var i = 1; i < tempResult.length; i++) {
    result.push(tempResult[i].slice(2, tempResult[i].length - 2));
  }
  return result;
}