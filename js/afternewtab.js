//这个文件是配合一些框架的js使用，因为框架的js必须要在html网页加载完之后再加载，而且chrome还不支持inline的js :(
$('#search_dropdown').dropdown();
$('.menu .item').tab();
$('select.dropdown').dropdown();
$('.ui.checkbox').checkbox();
// $('.ui.progress').progress('set percent', 80);
$('#achievement_progress_clip').progress("set percent", 45)
$('#achievement_progress_alive').progress("set percent", 65)

var achievementTime = [0, 1, 2, 3, 5, 8, 10]
var achievementType = ["alive", "clip", "Diana", "Eileen", "Bella", "Ava", "Carol", "niubi"]

achievementType.forEach(type => {
    var ms = "minute_" + type;
    var hs = "hour_" + type;
    chrome.storage.sync.get([ms, hs], function(res) {
        var m = res[ms];
        var h = res[hs];
        
        if(m == undefined){
            m = 0
        }
        if(h == undefined){
            h = 0;
        }

        var htop = 0;
        var hbom = 0;
        for (var i = 0; i < achievementTime.length; i++) {
            if (h < achievementTime[i]) {
                htop = achievementTime[i]
                hbom = achievementTime[i - 1]
                break
            }
        }

        $("#achievement_time_" + type).html(h + "H" + m + "Min / " + htop + "H")

        var per = (((h - hbom) * 60 + m) / ((htop - hbom) * 60)) * 100
        $("#achievement_progress_" + type).progress("set percent", per)

        console.log(type)
        console.log(per)
    })
})

