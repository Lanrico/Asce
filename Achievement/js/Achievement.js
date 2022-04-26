//页面加载完成执行
$(function() {
    generateTip()
    init()

    //设置定时器，每秒执行一次计时
    setInterval(function() {
        if (timer && isPlay()) {
            second_temp++;

            //当second_temp累计到60时，second_temp变为0，minute_temp加1
            if (second_temp >= 60) {
                minute_temp++
                second_temp = 0;

                //当minute_temp增加时，将minute_temp的数据储存到浏览器中
                setMinute_storage(minute_temp)
            }

            //当minute_temp累计到60时，minute_temp变为0，hour_temp加1
            if (minute_temp >= 60) {
                hour_temp++;
                minute_temp = 0;

                //当hour_temp增加时，将hour_temp的数据储存到浏览器中
                setHour_storage(hour_temp);

                //当hour_temp增加时，可能会显示成就弹窗
                showTip()
            }
        }
    }, 1000)
})

//检测是否正在直播
var isOnlive = function() {
    var bg = $(".web-player-icon-roomStatus").css("background-image");
    return (bg == "none")
}

//检测视频播放器是否正在播放
var isPlay = function() {
        var vdo = $("video")[0]
        return !vdo.paused
    }
    //根据不同类型的视频或者直播，将对应类型观看小时数储存到浏览器中
var setHour_storage = function(hour_set) {
    var str = 'hour_' + storageType;
    chrome.storage.sync.set({
        [str]: hour_set
    })
}

//根据不同类型的视频或者直播，将对应类型观看分钟数储存到浏览器中
var setMinute_storage = function(minute_set) {
    var str = 'minute_' + storageType;
    chrome.storage.sync.set({
        [str]: minute_set
    })
}

//将minute_temp和hour_temp设置为浏览器中已储存的对应类型的小时数和分钟数
var setMinuteAndHour_temp = function() {
    var m = 'minute_' + storageType;
    var h = 'hour_' + storageType;
    chrome.storage.sync.get([m, h], function(result) {
        minute_temp = result[m];
        hour_temp = result[h];
    })
}

//获取直播页面中up主的b站id
var getBid_live = function() {
    var info = $("#head-info-vm")[0];
    var node = info.firstChild.firstChild;
    var link = node.href
    var a = link.split("/")
    var bid = a[a.length - 2]
    return bid;
}

//获取视频页面中up主名字
var getAuthor_video = function() {
    var author = $("[name='author']").attr("content")
    return author;
}

//获取该页面是否为A-Soul官号
var setOfficial = function() {
    if (live) {
        var bid = getBid_live();
        var x = false
        asoul_info.forEach(i => {
            if (i.bid == bid) {
                x = true;
            }
        });
        official = x;
    }
    if (video) {
        var name = getAuthor_video();
        var x = false
        asoul_info.forEach(i => {
            if (i.name == name) {
                x = true;
            }
        })
        official = x;
    }

}

//获取当前视频的标签
var setTags = function() {
    var str = $("[name='keywords']").attr("content")
    var arr = str.split(",")
    tags = arr.slice(1, arr.length - 4)
}

//根据标签判断当前视频是否为A-Soul相关视频
var isClip = function() {
    var x = false;
    tags.forEach(ele => {
        console.log(ele)
        console.log(clipTags)
        console.log(clipTags.includes(ele))
        if (clipTags.includes(ele)) {
            x = true
        }
    })
    return x;
}

//获取当前页面是直播页面，还是视频页面
var setLiveAndVideo = function() {
    var url = window.location.href
    var reg_live = url.match("https://live.bilibili.com")
    var reg_video = url.match("https://www.bilibili.com/video/")
    live = Boolean(reg_live)
    video = Boolean(reg_video)
}

//对直播页面进行初始化
var init_live = function() {
    //将储存类型设置为live
    storage = "live";
    upbid = getBid_live()

    //每5秒判断当前直播页面是否正在直播，只对正在直播时累计成就时间
    setInterval(function() {
        if (isOnlive()) {
            timer = true
        } else {
            timer = false
        }
    }, 5000)
}

//对A-Soul相关视频页面进行初始化
var init_clip = function() {
    //将储存类型设置为clip
    storageType = "clip"
    author = getAuthor_video();
    timer = true;
}

//初始化
var init = function() {
    setLiveAndVideo();
    setOfficial();

    //如果是视频的话，获取它的标签
    if (video) {
        setTags()
    }

    //类型1，官号直播
    if (live && official) {
        init_live()
    }

    //类型2，A-Soul有关视频
    else if (isClip()) {
        init_clip()
    }

    //其他
    else {
        timer = false
        return
    }


    setMinuteAndHour_temp();
}

//如果当前时间有对应的成就的话，显示成就弹窗
var showTip = function() {
    var ach;

    //检测当前时间是否有成就
    achievement.forEach(function(ele) {
        if (ele.type == storageType && ele.hour == hour_temp) {
            ach = ele;
        }
    })

    //如果没有，直接结束
    if (!ach) {
        return
    }

    //成就标题
    var title = ach.title;
    //成就描述
    var describe = ach.describe;

    //在成就弹窗上设置成就标题和成就描述
    $("#tip-title").text(title);
    $("#tip-describe").text(describe);

    //设置成就弹窗的图片和背景
    $("#tip-div").css("background-image", "url(" + chrome.runtime.getURL(tip_img[0].bg) + ")")
    $("#tip-img").css("background-image", "url(" + chrome.runtime.getURL(tip_img[0].img) + ")")

    //淡入显示成就弹窗
    $("#tip-div").fadeIn()

    //10秒后淡出成就弹窗
    setTimeout(function() {
        if ($("#tip-div").css("display") != "none") {
            $("#tip-div").fadeOut()
        }
    }, 10000)
}

//在DOM中插入成就弹窗
var generateTip = function() {
    //生成弹窗的整体框架
    var div = document.createElement("div");
    div.id = "tip-div";
    div.className = "tip-div"

    //设置图片
    var img = document.createElement("div")
    img.id = "tip-img"
    img.className = "tip-img"
    div.appendChild(img)

    //设置标题
    var title = document.createElement("div")
    title.innerHTML = "刚刚入坑"
    title.id = "tip-title"
    title.className = "tip-title"
    div.appendChild(title)

    //设置描述
    var describe = document.createElement("div");
    describe.innerHTML = "观看1小时的二创视频"
    describe.id = "tip-describe";
    describe.className = "tip-describe"
    div.appendChild(describe)

    //设置关闭按钮
    var close = document.createElement("div");
    close.id = "tip-close";
    close.className = "tip-close";
    close.style.backgroundImage = "url(" + chrome.runtime.getURL("/img/close.png") + ")"
    div.appendChild(close)

    //在DOM中插入
    $("body").append($(div))

    //设置关闭按钮的鼠标事件
    $("#tip-close").on("click", function() {
        $("#tip-div").hide()
    })
}

//当前页面的观看时间
var second_temp = 0;
var minute_temp = 0;
var hour_temp = 0;

//控制是否要累计成就时间，true为累计，false为不累计
var timer = false;

//当前页面是否为直播页面
var live = false;

//当前页面是否为视频页面
var video = false;

//当前直播页面是否为官号
var official = false;

//储存类型live、clip
var storageType = ""

//当前页面up主b站id
var upbid = "";

//当前页面up主名字
var author = "";

//当前页面视频标签
var tags = [];

//A-Soul官号信息
var asoul_info = [{
    bid: "672328094",
    name: "嘉然今天吃什么"
}, {
    bid: "672346917",
    name: "向晚大魔王"
}, {
    bid: "672353429",
    name: "贝拉kira"
}, {
    bid: "351609538",
    name: "珈乐Carol"
}, {
    bid: "672342685",
    name: "乃琳Queen"
}, {
    bid: "703007996",
    name: "A-SOUL_Official"
}]

//A-soul相关视频的标签
var clipTags = ["珈乐", "贝拉", "乃琳", "向晚", "嘉然", "A-SOUL",
    "Diana", "Eileen", "Bella", "Ava", "Carol",
    "嘉然今天吃什么", "向晚大魔王", "贝拉kira", "珈乐Carol", "乃琳Queen",
]

//成就信息
var achievement = [{
    type: "clip",
    hour: 1,
    title: "踏上不归路的AU",
    describe: "观看1小时直播"
}]

//成就弹窗图片和背景
var tip_img = [{
    img: "/img/NewYearAva.gif",
    bg: "/img/bg_Ava.png"
}]