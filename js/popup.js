$(function () {
    $('#input1').keyup(function () {
        $('#message').text('你好，' + $('#input1').val());
    })
})

$(function () {
    $('#add').click(function () {
        // 从浏览器中获取存储的金额
        chrome.storage.sync.get('total', function (budget) {
            var totalAmount = 0;
            if (budget.total) {
                totalAmount = parseFloat(budget.xx);
            }
            // 将本次金额加到总金额并存储
            var amount = $('#amount').val();
            if (amount) {
                totalAmount += parseFloat(amount);
                chrome.storage.sync.set({
                    'total': totalAmount
                });
            }
            // 更新ui
            $('#total').text(totalAmount);
            $('#amount').val('');
        })
    })
})

function onAnchorClick(event) {
    chrome.tabs.create({
        url: event.srcElement.href
    });
    return false;
}

// Given an array of URLs, build a DOM list of these URLs in the
// browser action popup.
function buildPopupDom(mostVisitedURLs) {
    var popupDiv = document.getElementById('mostVisited_div');
    var ol = popupDiv.appendChild(document.createElement('ol'));

    for (var i = 0; i < mostVisitedURLs.length; i++) {
        var li = ol.appendChild(document.createElement('li'));
        var a = li.appendChild(document.createElement('a'));
        a.href = mostVisitedURLs[i].url;
        a.appendChild(document.createTextNode(mostVisitedURLs[i].title));
        a.addEventListener('click', onAnchorClick);
    }
}

chrome.topSites.get(buildPopupDom);

