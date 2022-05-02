
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
  $("#delete").click(function(){
    delete_item($(this).attr("bv"));
  });
}

function pgJump(q) {
  $("#pgn2").each(function() {
    $(this).click(function() {
      splitTable(parseInt($(this).attr("pgn")));
    });
  });
  $("#pgn").each(function() {
    $(this).click(function() {
      splitTable(parseInt($(this).attr("pgn")));
    });
  });
  $("#pgn3").each(function() {
    $(this).click(function() {
      splitTable(parseInt($(this).attr("pgn")));
    });
  });

  $(".left.chevron.icon").click(function() {
    l_pgn=parseInt($("#pgn").attr("pgn"))-1;
    console.log(l_pgn);
    splitTable(l_pgn);
  });
  $(".right.chevron.icon").click(function() {
    r_pgn=parseInt($("#pgn").attr("pgn"))+1;
    console.log(r_pgn);
    splitTable(r_pgn);
  });
}



function showTable(startRow, endRow, table) {
  var str = "";
  var button_dic = {
    1:"ui blue button",
    2:"ui red button",
    3:"ui violet button",
    4:"ui pink button",
    5:"ui black button",
    0:"ui button"
  }
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
    str += '<td><div class=\"ui rating\"></div></td>';

    // delete
    str += `<td><form><button class="${button_dic[asoul]}" id="delete" bv="${BV}" type = submit>删除</button></form></td>`;

    str += '</tr>';
  }
  contain = document.getElementById("contain");
  contain.innerHTML = str;

  $(".rating").rating();

  deleteItem();
  
};

// var clear = document.getElementById("clear-table");
// clear.onclick = function() {
//   chrome.storage.sync.remove('table');
// };


 function splitTable(pgn) {
   chrome.storage.sync.get('table',  function(result) {
    table = result.table;
    var num = table.length;//表格所有行数(所有记录数)
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
  if (totalPage <= 1) { 
    footStr += "<a class=\"active item\">1</a>";
  }
  else if (currentPage == totalPage) {
    footStr += "<a class=\"item\" id=\"pgn\" pgn=1>1</a>";
    footStr += `<a class=\"active item\" id=\"pgn2\" pgn=${currentPage}>${currentPage}</a>`;
  }
  else if (currentPage == 1) {
    footStr += "<a class=\"active item\" id=\"pgn\" pgn=1>1</a>";
    footStr += `<a class=\"item\" id=\"pgn2\" pgn=${totalPage}>${totalPage}</a>`;
  }
  else {
    footStr += "<a class=\"item\" id=\"pgn2\" pgn=1>1</a>";
    footStr += `<a class=\"active item\" id=\"pgn\" pgn=${currentPage}>${currentPage}</a>`;
    footStr += `<a class=\"item\" id=\"pgn3\" pgn=${totalPage}>${totalPage}</a>`;
  }
  // footStr += "<a class=\"icon item\"><i class=\"right chevron icon\"></i></a>";
  tableFoot = document.getElementById("table-foot");
  tableFoot.innerHTML = footStr;
   console.log(parseInt($("#pgn").attr("pgn")));

  pgJump();
}
