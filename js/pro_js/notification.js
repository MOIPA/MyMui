//var sellerNotiNum = 0;
//var tmpArr = new Array();
//var tmp = {};
//tmp.notifyNum = 0;
//tmpArr.push(tmp);
//localStorage.setItem('notify',JSON.stringify(tmpArr));

function test() {
	plus.nativeUI.toast("doing...");
}

function getSellerNoti() {
	if(JSON.parse(localStorage.getItem('user'))[0] != null) {
		mui.post('http://39.108.159.175/phpworkplace/mui/order/notify/getSellerNoti.php', {
			aid: new Number(JSON.parse(localStorage.getItem('user'))[0].aid),
			type: 'seller'
		}, function(data) {
			//		var tmp = data.length;
			//		if(tmp > sellerNotiNum) {
			var tmp = "";
			if(data != null) {
				for(var i = 0; i < data.length; i++) {
					tmp += "用户" + data[i].account + "选择了" + data[i].ordertheme + "\n";
				}
				plus.nativeUI.toast(tmp.trim());
				var wobj = plus.webview.getWebviewById("Hbuilder");
				wobj.beginPullToRefresh();
			}
			//			sellerNotiNum++;
			//		}
		}, 'json');
	}
	//	plus.nativeUI.toast("data.trim()");
}
mui.plusReady(function() {
	setInterval(getSellerNoti, 3000);

});