
//document.getElementsByTagName("BODY")[0].onpageshow = function() { showTable(); };
$(document).ready(function() {
  console.log("split");
  splitTable();

  var delete_EL = document.getElementById("delete");
  delete_EL.onclick = function() {
    chrome.storage.sync.get('table', function(result) {
      var BV = delete_EL.attributes[2].nodeValue;
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
});
function showTable(startRow, endRow, table) {
  var str = "";
  for (var i = startRow-1; i < endRow; i++) {
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
    str += `<td><button class="ui button" id="delete" bv="${BV}">delete</button></td>`;

    str += '</tr>';
  }
  contain = document.getElementById("contain");
  contain.innerHTML = str;
  $(".rating").rating();

};

var clear = document.getElementById("clear-table");
clear.onclick = function() {
  chrome.storage.sync.remove('table');
};


function splitTable() {
  chrome.storage.sync.get('table', function(result) {
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
    var currentPage = 1;//当前页数
    var startRow = (currentPage - 1) * pageSize + 1;//开始显示的行  1
    var endRow = currentPage * pageSize;//结束显示的行   15
    endRow = (endRow > num) ? num : endRow;
    showTable(startRow, endRow, table);
  });
}


function showFoot(){
  var footStr="";
}
