document.addEventListener("click", function() {
    console.log("点了一下");

    // if ($("#extest").length <= 0) {
    //     var div = document.createElement("div");
    //     div.className = "block color"
    //     div.id = "extest"
    //     var body = document.getElementsByTagName("body")[0]
    //     body.appendChild(div);
    // }


    // showMinute_block();


    // var url = window.location.href
    // var reg_live = url.match("https://live.bilibili.com")
    // var reg_video = url.match("https://www.bilibili.com/video/")

    // var author = getAuthor()
    // console.log(author)

    // setTags()

    // showTip()

    console.log(isOnlive())


})

// $(".block").on("load", function() {
//     console.log("adfawsukghsadoufoaeuwhf")

// })
$(document).on("click", function() {




})

$(function() {



    generateTip()


    init()



    setInterval(function() {
        // console.log("timer: " + timer)
        if (timer && isPlay()) {
            second_temp++;
            if (second_temp >= 60) {
                minute_temp++
                second_temp = 0;

                setMinute_storage(minute_temp)
                showTip()
            }
            if (minute_temp >= 60) {
                hour_temp++;
                minute_temp = 0;

                setHour_storage(hour_temp);
            }
        }
        // console.log(second_temp)
        // console.log("minute:   " + minute_temp)
    }, 1000)

    showTip();

})

var isOnlive = function() {
    var bg = $(".web-player-icon-roomStatus").css("background-image");
    return (bg == "none")
}

var isPlay = function() {
    var vdo = $("video")[0]
    return !vdo.paused

    // console.log("video pause   " + vdo.duration)




    // var player = $("#bilibiliPlayer")[0]
    // var playerState = player.children[0].classList
    // for (var i = 0; i < playerState.length; i++) {
    //     if (playerState[i] == "video-state-pause") {
    //         return false;
    //     }
    // }
    // return true;
}



// var getMinute = function() {
//     var m = -1;
//     getMinute_async()
//     return m;
// }

// var getMinute_async = async function() {
//     var minute_get = -1;

//     // chrome.storage.local.get(['minute'], function(result) {
//     //     if (result.minute) {
//     //         minute_get = parseInt(result.minute)
//     //         console.log("minute exist" + minute_get)



//     //     }
//     // })

//     await getm_await1().then(res => {
//         minute_get = parseInt(res);
//     });

//     // getm_await1().then(res => {
//     //     console.log("res:   " + res)
//     //     minute_get = res;
//     // });
//     // return minute_get


//     console.log("get get minute" + minute_get)
//     return new Promise(resolve => {
//         resolve(minute_get)
//     })
// }

// var getm_await1 = async function() {
//     return new Promise((resolve) => {
//         chrome.storage.sync.get(['minute'], function(result) {
//             if (result.minute) {
//                 minute_get = parseInt(result.minute)
//                 resolve(parseInt(result.minute))
//                 console.log("minute exist" + minute_get)
//             }
//         })
//     })
// }

// var getm_await2 = function() {
//     return new Promise((resolve, reject) => {

//     })
// }

// var showMinute_block = function() {
//     chrome.storage.sync.get(['minute'], function(result) {
//         if (result.minute) {
//             $("#extest").append("<p>" + result.minute + "</p>")
//         }

//     })
// }

var setHour_storage = function(hour_set) {
    var str = 'hour_' + storageType;
    chrome.storage.sync.set({
        [str]: hour_set
    })
}

var setMinute_storage = function(minute_set) {
    var str = 'minute_' + storageType;
    chrome.storage.sync.set({
        [str]: minute_set
    })
}

var setMinuteAndHour_temp = function() {
    var m = 'minute_' + storageType;
    var h = 'hour_' + storageType;
    chrome.storage.sync.get([m, h], function(result) {
        minute_temp = result[m];
        hour_temp = result[h];
    })
}

var getBid_live = function() {
    var info = $("#head-info-vm")[0];
    var node = info.firstChild.firstChild;
    var link = node.href
    var a = link.split("/")
    var bid = a[a.length - 2]
    return bid;
}

var getAuthor_video = function() {
    var author = $("[name='author']").attr("content")
    return author;
}

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

var setTags = function() {
    var str = $("[name='keywords']").attr("content")
    var arr = str.split(",")
    tags = arr.slice(1, arr.length - 4)
}

var isClip = function() {
    var x = false;



    tags.forEach(ele => {
        console.log(ele)
        console.log(clipTags)
        console.log(clipTags.includes(ele))
        if (clipTags.includes(ele)) {



            console.log("the is clip() does not have any bug..........")
            x = true
        }
    })

    console.log("the isclip has bugs??????")
    return x;
}

var setLiveAndVideo = function() {
    var url = window.location.href
    var reg_live = url.match("https://live.bilibili.com")
    var reg_video = url.match("https://www.bilibili.com/video/")
    live = Boolean(reg_live)
    video = Boolean(reg_video)
}

var init_live = function() {
    storage = "live";
    upbid = getBid_live()
    setInterval(function() {
        if (isOnlive()) {
            timer = true
        } else {
            timer = false
        }
    }, 5000)
}

var init_clip = function() {
    storageType = "clip"
    author = getAuthor_video();
    timer = true;
}

var init = function() {
    setLiveAndVideo();
    setOfficial();
    if (video) {
        setTags()
    }

    if (live && official) {
        init_live()
    } else if (isClip()) {
        init_clip()
    } else {
        timer = false
        return
    }


    setMinuteAndHour_temp();
}

var showTip = function() {
    var ach;
    achievement.forEach(function(ele) {
        if (ele.type == storageType && ele.hour == hour_temp) {
            ach = ele;
        }
    })

    console.log(ach)

    if (!ach) {
        return
    }

    var title = ach.title;
    var describe = ach.describe;

    $("#tip-title").text(title);
    $("#tip-describe").text(describe);

    console.log(chrome.runtime.getURL(tip_img[0].bg))

    $("#tip-div").css("background-image", "url(" + chrome.runtime.getURL(tip_img[0].bg) + ")")
    $("#tip-img").css("background-image", "url(" + chrome.runtime.getURL(tip_img[0].img) + ")")

    $("#tip-div").fadeIn()
    setTimeout(function() {
        if ($("#tip-div").css("display") != "none") {
            $("#tip-div").fadeOut()
        }
    }, 10000)
}

var generateTip = function() {
    var div = document.createElement("div");
    div.id = "tip-div";
    div.className = "tip-div"

    var img = document.createElement("div")
    img.id = "tip-img"
    img.className = "tip-img"
    div.appendChild(img)

    var title = document.createElement("div")
    title.innerHTML = "刚刚入坑"
    title.id = "tip-title"
    title.className = "tip-title"
    div.appendChild(title)

    var describe = document.createElement("div");
    describe.innerHTML = "观看1小时的二创视频"
    describe.id = "tip-describe";
    describe.className = "tip-describe"
    div.appendChild(describe)

    var close = document.createElement("div");
    close.id = "tip-close";
    close.className = "tip-close";
    close.style.backgroundImage = "url(" + chrome.runtime.getURL("/img/close.png") + ")"
    div.appendChild(close)




    $("body").append($(div))
    $("#tip-close").on("click", function() {
        $("#tip-div").hide()
    })
}

var second_temp = 0;
var minute_temp = 0;
var hour_temp = 0;
var timer = false;
var live = false;
var video = false;
var onlive = false;
var official = false;
var storageType = ""
var upbid = "";
var author = "";
var tags = [];

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

var clipTags = ["珈乐", "贝拉", "乃琳", "向晚", "嘉然", "A-SOUL",
    "Diana", "Eileen", "Bella", "Ava", "Carol",
    "嘉然今天吃什么", "向晚大魔王", "贝拉kira", "珈乐Carol", "乃琳Queen",
]

var achievement = [{
    type: "clip",
    hour: 1,
    title: "踏上不归路的AU",
    describe: "观看1小时直播"
}]

var tip_img = [{
    img: "/img/NewYearAva.gif",
    bg: "/img/bg_Ava.png"
}]