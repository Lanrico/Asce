//var html = document.body.innerHTML;
chrome.storage.sync.get('table',function(result){
	if (result.table==null){
		var table=new Array();
		chrome.storage.sync.set({table:table},function(){
			console.log("created");
		});
	}
})
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "hello") {
		// get username

      var name = document.getElementsByClassName("username");
      console.log(name);
      //alert(title);
      cont = name[0].innerText;
      console.log(cont);

		// get title
      var title = document.getElementsByClassName("video-title");
      console.log(title);
		const clip={"title":tit,"user":cont,"link":"https://bilibili.com"};
		const data=JSON.stringify(clip);
		localStorage['table']=data;
		var read=localStorage.table;
		console.log(read);

		// send response

		sendResponse(data);

		//store

		chrome.storage.sync.get('table',function(result){
			console.log("get"+result.table);
			tmp=result.table;
			tmp.push(clip);
			console.log(tmp);
			alert("clip success")
			chrome.storage.sync.set({table:tmp},function(){
				console.log("succ");
				chrome.storage.sync.get('table',function(result){
					console.log("get"+result.table);
				});
			});
		});
    }
    else
      sendResponse("null");
  });
