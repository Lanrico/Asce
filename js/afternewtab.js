//这个文件是配合一些框架的js使用，因为框架的js必须要在html网页加载完之后再加载，而且chrome还不支持inline的js :(
$('#search_dropdown').dropdown();
$('.menu .item').tab();
$('.search.dropdown').dropdown();
$('.ui.checkbox').checkbox();
// $('.ui.progress').progress('set percent', 80);
$('#achievement_progress_clip').progress("set percent", 45)
$('#achievement_progress_alive').progress("set percent", 65)

//成就的各个时间阶段
var achievementTime = [0, 1, 2, 5, 10, 20, 50, 100, 1000]
//所有的成就类型
var achievementType = ["alive", "clip", "Diana", "Eileen", "Bella", "Ava", "Carol", "niubi"]

//设置成就页面
//遍历每一种成就
achievementType.forEach(type => {
    var ms = "minute_" + type;
    var hs = "hour_" + type;

    //从chrome.storage中获取当前成就的时间
    chrome.storage.sync.get([ms, hs], function(res) {
        var m = res[ms];
        var h = res[hs];
        
        //如果第一次使用此插件，将时间显示为0
        if(m == undefined){
            m = 0
        }
        if(h == undefined){
            h = 0;
        }

        //到达下一阶段的时间
        var htop = 0;
        //上一阶段的时间
        var hbom = 0;
        for (var i = 0; i < achievementTime.length; i++) {
            if (h < achievementTime[i]) {
                htop = achievementTime[i]
                hbom = achievementTime[i - 1]
                break
            }
        }

        //显示具体时间
        $("#achievement_time_" + type).html(h + "h " + m + "min / " + htop + "h")

        //计算从上一阶段到下一阶段的百分比
        var per = (((h - hbom) * 60 + m) / ((htop - hbom) * 60)) * 100
        //通过进度条显示百分比
        $("#achievement_progress_" + type).progress("set percent", per)

        console.log(type)
        console.log(per)
    })
})

