
document.getElementsByTagName("BODY")[0].onpageshow = function() {showTable()};
function showTable() {
	chrome.storage.sync.get('table',function(result){
		table=result.table;
		var str="";
		for(var i = 0 ; i <= table.length-1 ; i++){
   		    str += '<tr>';
   		    str += '<td>';
   		    str+=table[i]['title'];
   		    str += '</td>';
   		    str += '<td>';
   		    str+=table[i]['user'];
   		    str += '</td>';
   		    str += '<td>';
   		    str+=table[i]['link'];
   		    str += '</td>';
   		    str += '</tr>';
   		}
		contain=document.getElementById("contain");
		contain.innerHTML = str;
	});
};
