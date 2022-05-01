
//页面加载完成执行
$(function() {
    // loadJson()
    setSettings()
    init_storage()
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

                addMinute_storage()

                // showTip()

                // //当minute_temp增加时，将minute_temp的数据储存到浏览器中
                // setMinute_storage(minute_temp)
            }

            //当minute_temp累计到60时，minute_temp变为0，hour_temp加1
            if (minute_temp >= 60) {
                hour_temp++;
                minute_temp = 0;

                // //当hour_temp增加时，将hour_temp的数据储存到浏览器中
                // setHour_storage(hour_temp);

                //当hour_temp增加时，可能会显示成就弹窗
                showTip()
            }
        }
        console.log(second_temp);
        console.log("timer: " + timer)

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

// //根据不同类型的视频或者直播，将对应类型观看小时数储存到浏览器中
// var setHour_storage = function(hour_set) {
//     var str = 'hour_' + storageType;
//     chrome.storage.sync.set({
//         [str]: hour_set
//     })
// }

// //根据不同类型的视频或者直播，将对应类型观看分钟数储存到浏览器中
// var setMinute_storage = function(minute_set) {
//     var str = 'minute_' + storageType;
//     chrome.storage.sync.set({
//         [str]: minute_set
//     })
// }

// //将minute_temp和hour_temp设置为浏览器中已储存的对应类型的小时数和分钟数
// var setMinuteAndHour_temp = function() {
//     var m = 'minute_' + storageType;
//     var h = 'hour_' + storageType;

//     chrome.storage.sync.get([m, h], function(result) {
//         if (result[m] == undefined) {
//             minute_temp == 0;
//         } else {
//             minute_temp = result[m];
//         }
//         if (result[h] == undefined) {
//             hour_temp == 0;
//         } else {
//             hour_temp = result[h];
//         }
//     })
// }

//根据当前页面类型，为每种类型各加1min
var addMinute_storage = function() {
    AchievementType.forEach(type => {
        var ms = 'minute_' + type;
        var hs = 'hour_' + type;

        chrome.storage.sync.get([ms, hs], function(result) {
            var m = result[ms];
            var h = result[hs];
            if (m >= 59) {
                chrome.storage.sync.set({
                    [ms]: 0,
                    [hs]: ++h
                })
            } else {
                chrome.storage.sync.set({
                    [ms]: ++m
                })
            }
        })
    })
}

//如果是第一次使用此插件，将chrome.storage中成就时间设为0
var init_storage = function() {
    var temp = []
    AchievementType_all.forEach(ele => {
        temp.push("minute_" + ele)
        temp.push("hour_" + ele)
    })

    chrome.storage.sync.get(temp, function(res) {
        temp.forEach(ele => {
            if (res[ele] == undefined) {
                chrome.storage.sync.set({
                    [ele]: 0
                })
            }
        });
    })
}

//获取直播页面中up主的b站id
var getBid_live = function() {
    var author = $("[name='keywords']").attr("content").split(",")[0]
    var bid = ""
    asoul_info.forEach(element => {
        if (element.name == author) {
            bid = element.bid
        }
    });
    return bid;
}

//获取视频页面中up主名字
var getAuthor_video = function() {
    var author = $("[name='author']").attr("content")
    return author;
}

//获取该页面是否为A-Soul官号
var setOfficial = function() {
    var x = false
    asoul_info.forEach(i => {
        if (i.bid == mid) {
            x = true;
        }
    });
    official = x

    // if (live) {
    //     var bid = getBid_live();
    //     var x = false
    //     asoul_info.forEach(i => {
    //         if (i.bid == bid) {
    //             x = true;
    //         }
    //     });
    //     official = x;
    // }
    // if (video) {
    //     var name = getAuthor_video();
    //     var x = false
    //     asoul_info.forEach(i => {
    //         if (i.name == name) {
    //             x = true;
    //         }
    //     })
    //     official = x;
    // }

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
        if (clipTags.includes(ele)) {
            x = true
        }
    })
    return x && video;
}

//当前页面是否时官号直播
var isAlive = function() {
    return official && live;
}

//根据视频标签判断当前页面是否是嘉然二创
var isDiana = function() {
    var x = tags.includes("嘉然") || tags.includes("Diana") || tags.includes("嘉然今天吃什么");
    return x && video
}

var isEileen = function() {
    var x = tags.includes("乃琳") || tags.includes("乃琳") || tags.includes("乃琳Queen");
    return x && video

}

var isBella = function() {
    var x = tags.includes("贝拉") || tags.includes("Bella") || tags.includes("贝拉kira");
    return x && video
}

var isAva = function() {
    var x = tags.includes("向晚") || tags.includes("Ava") || tags.includes("向晚大魔王");
    return x && video
}

var isCarol = function() {
    var x = tags.includes("珈乐") || tags.includes("Carol") || tags.includes("珈乐Carol");
    return x && video
}

//当前视频的标签是否有“勇敢牛牛”
var isNiubi = function() {
    var x = tags.includes("勇敢牛牛")
    return x && video
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
var init_alive = function() {
    //将储存类型设置为live
    storage = "live";
    mid = getBid_live()

    //每5秒判断当前直播页面是否正在直播，只对正在直播时累计成就时间
    setInterval(function() {
        if (isOnlive()) {
            timer = true
        } else {
            timer = false
        }
    }, 5000)
}

// //对A-Soul相关视频页面进行初始化
// var init_clip = function() {
//     //将储存类型设置为clip
//     storageType = "clip"
//     author = getAuthor_video();
//     timer = true;
// }

//初始化
var init = function() {
    setLiveAndVideo();

    //如果是视频的话，获取它的标签
    if (video) {
        setTags()
        init_video()
    }
    if (live) {
        init_live()
    }

    // while (!mutex_mid) {
    //     console.log("mutex_mid")
    // }


    // //类型1，官号直播
    // if (live && official) {
    //     init_alive()
    // }

    // //类型2，A-Soul有关视频
    // else if (isClip()) {
    //     init_clip()
    // }




    // setMinuteAndHour_temp();
}

//设置当前页面成就类型，并且设置timer
var init_AchievementType = function() {
    setAchievementType()
        //当前页面只要满足一种成就类型就进行计数，否则不计数
    if (AchievementType.length > 0) {
        timer = true;
    } else {
        timer = false
    }
}

//初始化视频页面
var init_video = function() {
    //获取up主mid
    var a = window.location.href.split("?")[0].split("/")
    var bv = a[a.length - 1]
    fetch("https://api.bilibili.com/x/web-interface/view?bvid=" + bv)
        .then(response => response.json())
        .then(function(json) {
            mid = json.data.owner.mid
            setOfficial();
            init_AchievementType()
        })
}

//初始化直播页面
var init_live = function() {
    //获取up主mid
    var a = window.location.href.split("?")[0].split("/")
    var id = a[a.length - 1]
    fetch("https://api.live.bilibili.com/room/v1/Room/room_init?id=" + id)
        .then(response => response.json())
        .then(function(json) {
            mid = json.data.uid
            setOfficial()
            init_AchievementType()
        })

    //检测是否正在直播，只有正在直播时才会计算时间
    setInterval(function() {
        var a = window.location.href.split("?")[0].split("/")
        var id = a[a.length - 1]
        fetch("https://api.live.bilibili.com/room/v1/Room/room_init?id=" + id)
            .then(response => response.json())
            .then(function(json) {
                if (json.data.live_status == 1) {
                    timer = true;
                } else {
                    timer = false;
                }
            })
    }, 5000)
}

//设置当前页面的成就种类
var setAchievementType = function() {
    if (isAlive()) {
        AchievementType.push("alive")
    }
    if (isClip()) {
        AchievementType.push("clip")
    }
    if (isDiana()) {
        AchievementType.push("Diana")
    }
    if (isEileen()) {
        AchievementType.push("Eileen")
    }
    if (isAva()) {
        AchievementType.push("Ava")
    }
    if (isBella()) {
        AchievementType.push("Bella")
    }
    if (isCarol()) {
        AchievementType.push("Carol")
    }
    if (isNiubi()) {
        AchievementType.push("niubi")
    }
}

//如果当前时间有对应的成就的话，显示成就弹窗
var showTip = function() {
    //遍历当前页面所有成就类型
    AchievementType.forEach(function(ele) {
        // if (AchievementType.includes(ele.type) && ele.hour == hour_temp && ele.minute == ) {
        //     ach = ele;
        // }

        var ms = 'minute_' + ele;
        var hs = 'hour_' + ele;

        //从浏览器中获取对应成就类型的时间
        chrome.storage.sync.get([ms, hs], function(result) {
            var m = result[ms];
            var h = result[hs];

            //如果当前时间完成了一个阶段并且设置中启用了成就弹窗
            if (achievementTime.includes(h) && showTip_setting) {
                // //如果没有或者设置了不显示，直接结束
                // if (!ach || !showTip_setting) {
                //     return;
                // }

                //成就标题
                var title = "已经看了" + h + "小时了！";
                //成就描述
                var a = achievementTime;
                var describe = "再接再厉看到" + (a[a.indexOf(h) + 1] - h).toString() + "小时";

                //在成就弹窗上设置成就标题和成就描述
                $("#tip-title").text(title);
                $("#tip-describe").text(describe);

                //设置成就弹窗的图片和背景
                setTipDesign(ele)
                    // $("#tip-div").css("background-image", "url(" + chrome.runtime.getURL(tip_img[0].bg) + ")")
                    // $("#tip-img").css("background-image", "url(" + chrome.runtime.getURL(tip_img[0].img) + ")")

                //淡入显示成就弹窗
                $("#tip-div").fadeIn()

                //根据设置的时间淡出成就弹窗
                setTimeout(function() {
                    if ($("#tip-div").css("display") != "none") {
                        $("#tip-div").fadeOut()
                    }
                }, TipTime_setting * 1000)
            }
        })
    })
}

//根据成就类型为成就弹窗设置背景颜色和图片
function setTipDesign(type) {
    if (!Object.keys(TipDesign).includes(type)) {
        type = Object.keys(TipDesign)[Math.floor(Math.random() * 5)]
    }

    $("#tip-div").css("background-color", TipDesign[type].color)
    $("#tip-img").css("background-image", "url(" + chrome.runtime.getURL(TipDesign[type].img) + ")")

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
    close.className = "tip-close ";
    close.style.backgroundImage = "url(" + chrome.runtime.getURL("/img/close.png") + ")"
    div.appendChild(close)

    //在DOM中插入
    $("body").append($(div))

    //设置关闭按钮的鼠标事件
    $("#tip-close").on("click", function() {
        $("#tip-div").hide()
    })
}

// //加载json文件
// var loadJson = function() {
//     //获取成就信息
//     fetch(chrome.runtime.getURL("/json/Achievement.json"))
//         .then(response => response.json())
//         .then(function(json) {
//             achievement = json;
//         })

//     //获取设置信息
//     fetch(chrome.runtime.getURL("/json/Setting.json"))
//         .then(response => response.json())
//         .then(function(json) {
//             TipTime_setting = json.TipTime_setting;
//             showTip_setting = json.showTip_setting;
//         })
// }

//获取设置
var setSettings = function() {
    chrome.storage.sync.get(['achievement_popup', 'achievement_popupTime'], function(res) {
        if (res.achievement_popup != undefined) {
            var st = res.achievement_popup
            var tt = res.achievement_popupTime
            TipTime_setting = tt;
            showTip_setting = st;
        }
    })
}

//当前页面的观看时间
var second_temp = 0;
var minute_temp = 0;
var hour_temp = 0;

//控制是否要累计成就时间，true为累计，false为不累计
var timer = false;

//初始化时要保证先获取到mid再进行之后的初始化操作
var mutex_mid = false;

//当前页面是否为直播页面
var live = false;

//当前页面是否为视频页面
var video = false;

//当前直播页面是否为官号
var official = false;

var onlive = false;

//储存类型live、clip
// var storageType = ""
var AchievementType = []

//当前页面up主b站id
var mid = "";

//当前页面up主名字
var author = "";

//当前页面视频标签
var tags = [];

//newTab可以设置的
var showTip_setting = true;
var TipTime_setting = 10;

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
    "Diana", "Elieen", "Bella", "Ava", "Carol",
    "嘉然今天吃什么", "向晚大魔王", "贝拉kira", "珈乐Carol", "乃琳Queen",
]

//从Achievement.json中读取
var achievement = []

//成就弹窗图片和背景
var tip_img = [{
    img: "/img/NewYearAva.gif",
    bg: "/img/bg_Ava.png"
}]

//所有种类的成就
var AchievementType_all = ["alive", "clip", "Diana", "Eileen", "Bella", "Ava", "Carol", "niubi"]

//成就时间
var achievementTime = [0, 1, 2, 3, 5, 8, 10]

//成就弹窗的背景颜色以及图片
var TipDesign = {
    "Diana": {
        color: "rgb(231, 153, 176)",
        img: "/img/WeAre_Diana.png"
    },
    "Eileen": {
        color: "rgb(86, 101, 143)",
        img: "/img/WeAre_Eileen.png"
    },
    "Bella": {
        color: "rgb(251, 97, 86)",
        img: "/img/WeAre_Bella.png"
    },
    "Ava": {
        color: "rgb(154, 200, 226)",
        img: "/img/WeAre_Ava.png"
    },
    "Carol": {
        color: "rgb(184, 166, 217)",
        img: "/img/WeAre_Carol.png"
    },
}