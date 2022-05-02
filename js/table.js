
//document.getElementsByTagName("BODY")[0].onpageshow = function() { showTable(); };
$("[data-tabe='favorites']").ready(function() {
  console.log("split");
  async function init() {
    var num = await splitTable(1);
  }
  init();
});
// $(document).ready(function() {
//   console.log("split");
//   new Promise(function(resolve, reject) {
//     splitTable(1);
//   })
//     .then(deleteItem())
//     .then(pgJump());
// });

function deleteItem() {
  function delete_item(BV) {
    chrome.storage.sync.get('table', function(result) {
      var table = result.table;
      for (var i = 0; i < table.length; i++) {
        if (table[i]['link'] == BV) {
          table.splice(i, 1);
          console.log(table);
        }
      }
      console.log(table);
      chrome.storage.sync.set({ table: table }, function() { });
    });
  };
  $(".ui.button").each(function() {
    $(this).click(function() {
      delete_item($(this).attr("bv"));
      setTimeout(function() {
        splitTable(1);
      }, 100);
    });
  });
}

var cPgn = 1;

var totalPgn = 3;

function pgJump() {
  $(".item.pgn").each(function() {
    var thisPgn = parseInt($(this).attr("pgn"));
    console.log(thisPgn);
    $(this).click(function() {
      splitTable(thisPgn);
      cPgn = thisPgn;
    });
    if (Math.abs(thisPgn - cPgn) >= 3 && thisPgn != 1 && thisPgn != totalPgn) {
      $(this).hide();
    }
    if (thisPgn == cPgn) {
      $(this).attr("class", "active item");
    }
  });

  $(".item.more.left").each(function() {
    if (cPgn - 1 <= 3) {
      $(this).hide();
    }
  });
  $(".item.more.right").each(function() {
    if (totalPgn - cPgn <= 3) {
      $(this).hide();
    }
  });


  $(".left.chevron.icon").click(function() {
    l_pgn = parseInt($("#pgn").attr("pgn")) - 1;
    console.log(l_pgn);
    splitTable(l_pgn);
  });
  $(".right.chevron.icon").click(function() {
    r_pgn = parseInt($("#pgn").attr("pgn")) + 1;
    console.log(r_pgn);
    splitTable(r_pgn);
  });
  $(".rating").click(function() {
    setScore();
  });

}



function showTable(startRow, endRow, table) {
  var str = "";
  var button_dic = {
    1: "ui blue button",
    2: "ui red button",
    3: "ui violet button",
    4: "ui pink button",
    5: "ui black button",
    0: "ui button"
  };
  for (var i = startRow - 1; i < endRow; i++) {
    console.log("llll");
    str += '<tr>';

    // title
    str += '<td>';
    str += table[i]['title'];
    str += '</td>';
    str += '<td>';

    // User icon and name
    var asoul = table[i]['asoul'];
    str += '<h4 class=\"ui image header\">';
    str += `<img src="/img/bag/${asoul}.png" class="ui mini rounded image">`;
    str += '<div class="content">';
    str += table[i]['user'];
    str += '</div></h4></td>';

    // link and BV
    var link = 'https://bilibili.com/video/' + table[i]['link'];
    str += '<td>';
    str += `<a href=${link}>`;
    var BV = table[i]['link'];
    str += BV;
    str += '</a>';
    str += '</td>';

    // rating
    var score = table[i]['score'];
    str += `<td><div class=\"ui rating\" data-rating="${score}" bv="${BV}" data-max-rating="5"></div></td>`;

    // delete
    // str += `<td><button class="${button_dic[asoul]}" id="delete" bv="${BV}">删除</button></td>`;
    str += `<td><button class="${button_dic[asoul]}" id="delete" bv="${BV}">删除</button></td>`;

    str += '</tr>';
  }
  contain = document.getElementById("contain");
  contain.innerHTML = str;

  // $(".rating").rating();
  $('.ui.rating')
    .rating()
    ;

  deleteItem();

};


// var clear = document.getElementById("clear-table");
// clear.onclick = function() {
//   chrome.storage.sync.remove('table');
//   setTimeout(function() {
//     splitTable(1);
//   }, 100);
// };


function splitTable(pgn) {
  chrome.storage.sync.get('table', function(result) {
    table = result.table;
    var num = 0;
    if (table)
      num = table.length;//表格所有行数(所有记录数)
    var totalPage = 0;//总页数
    var pageSize = 4;//每页显示行数
    //总共分几页
    if (num / pageSize > parseInt(num / pageSize)) {
      totalPage = parseInt(num / pageSize) + 1;
    } else {
      totalPage = parseInt(num / pageSize);
    }
    var currentPage = pgn;//当前页数
    var startRow = (currentPage - 1) * pageSize + 1;//开始显示的行  1
    var endRow = currentPage * pageSize;//结束显示的行   15
    endRow = (endRow > num) ? num : endRow;
    totalPgn = totalPage;
    showTable(startRow, endRow, table);
    showFoot(currentPage, totalPage);
  });
  return 0;
}


function showFoot(currentPage, totalPage) {
  var footStr = "";
  footStr += "<tr><th colspan=\"5\">";
  footStr += "<div class=\"ui right floated pagination menu\">";
  // footStr += "<a class=\"icon item\"><i class=\"left chevron icon\"></i></a>";
  footStr += `<a class="item pgn" pgn="1">1</a>`;
  footStr += `<a class="item more left">...</a>`;
  if (totalPage > 2) {
    for (var x = 2; x < totalPage; x++) {
      footStr += `<a class="item pgn" pgn=${x}>${x}</a>`;
    }
  }
  footStr += `<a class="item more right">...</a>`;
  footStr += `<a class="item pgn" pgn=${totalPage}>${totalPage}</a>`;
  // footStr += "<a class=\"icon item\"><i class=\"right chevron icon\"></i></a>";
  tableFoot = document.getElementById("table-foot");
  tableFoot.innerHTML = footStr;

  pgJump();
}

function setScore() {
  $(".rating").rating('setting', 'onRate', function(value) {
    console.log(value);
    function set_score(BV, value) {
      chrome.storage.sync.get('table', function(result) {
        var table = result.table;
        for (var i = 0; i < table.length; i++) {
          if (table[i]['link'] == BV) {
            table[i]['score'] = value;
          }
        }
        console.log(table);
        chrome.storage.sync.set({ table: table }, function() { });
      });
    };
    var bv = $(this).attr("bv");
    set_score(bv, value);
  });
}
