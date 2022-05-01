//直播通知功能
function live_notification(live_id, name, icon_url) {
    //通过b站的api获取直播间信息
    fetch('https://api.live.bilibili.com/room/v1/Room/room_init?id=' + live_id)
        .then(function (response) {
            return response.text(); //直播间信息作为字符串返回
        }).then(function (myJson) {
            bilibiliStream = myJson;
            judgeString = /"live_status":1/;
            isLive = judgeString.test(bilibiliStream); //正则表达式判断是否在直播（"live_status":1 为正在直播状态）

            //获取当前的直播时长
            liveBeginTime = bilibiliStream.split('"live_time":')[1];
            liveBeginTime = liveBeginTime.split(',"room_shield"')[0]
            var nowTime = new Date().getTime() / 1000;
            liveTime = nowTime - liveBeginTime;
            console.log(liveTime);
            //直播间正在直播并且直播时长小于一定数值时弹出window提醒（确保一场直播只提醒一次）
            if (isLive & (liveTime <= 120)) {
                create_notification(live_id, name, icon_url);
                // console.log("notification!")
            }
        })
}

var live_info_list = [
    [22637261, '嘉然今天吃什么', 'https://i2.hdslb.com/bfs/face/d399d6f5cf7943a996ae96999ba3e6ae2a2988de.jpg@240w_240h_1c_1s.webp'],
    [22625025, '向晚大魔王', 'https://i0.hdslb.com/bfs/face/566078c52b408571d8ae5e3bcdf57b2283024c27.jpg@240w_240h_1c_1s.webp'],
    [22625027, '乃琳Queen', 'https://i1.hdslb.com/bfs/face/8895c87082beba1355ea4bc7f91f2786ef49e354.jpg@240w_240h_1c_1s.webp'],
    [22634198, '珈乐Carol', 'https://i1.hdslb.com/bfs/face/a7fea00016a8d3ffb015b6ed8647cc3ed89cbc63.jpg@240w_240h_1c_1s.webp'],
    [22632424, '贝拉kira', 'https://i2.hdslb.com/bfs/face/668af440f8a8065743d3fa79cfa8f017905d0065.jpg@240w_240h_1c_1s.webp'],
    [22632157, 'A-SOUL_Official', 'https://i2.hdslb.com/bfs/face/43b21998da8e7e210340333f46d4e2ae7ec046eb.jpg@240w_240h_1c_1s.webp'],
]

var liveReminder_list = ['liveReminder_Diana', 'liveReminder_Ava', 'liveReminder_Eileen', 'liveReminder_Carol', 'liveReminder_Bella', 'liveReminder_Official'];

// 调用桌面通知

setInterval(function (e) {
    chrome.storage.sync.get(liveReminder_list, function (status) {
        var liveReminder_status = []
        for (let i = 0; i < liveReminder_list.length; i++) {
            liveReminder_status.push(status[liveReminder_list[i]]);
        }
        console.log(liveReminder_status)
        for (let i = 0; i < live_info_list.length; i++) {
            if (liveReminder_status[i] == true) {
                live_notification(live_info_list[i][0], live_info_list[i][1], live_info_list[i][2]);
            }
        }
    })
    // 一定时间后清理对应id的通知
    setTimeout(function (e) {
        chrome.notifications.clear("id");
    }, 600000);
}, 99999);



function create_notification(live_id, name, icon_url) {
    // 调用桌面通知
    //使用前先打开windows通知设置，然后打开chrome通知权限
    chrome.notifications.create("id", {
        type: 'basic',
        title: name + '正在直播',
        message: '点击进入直播间',
        iconUrl: icon_url
    });

    //点击通知进入直播间
    chrome.notifications.onClicked.addListener(function (notificationId) {
        chrome.tabs.create({
            url: 'https://live.bilibili.com/' + live_id
        });
    });
}