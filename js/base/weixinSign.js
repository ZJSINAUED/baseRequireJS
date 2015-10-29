define(['wx','jsonp'],function(wx,jsonp){
	jsonp('http://common.zj.sina.com.cn/weixin/get_sign.php',{location_url:encodeURIComponent(location.href.split('#')[0])},function(json){
		if (json.error == 0){
			var data = json.data;
			wx.config({
				appId: data.appId,
				timestamp: data.timestamp,
				nonceStr: data.nonceStr,
				signature: data.signature,
				//debug: true,
				jsApiList: [
					'checkJsApi',
					'onMenuShareTimeline',
					'onMenuShareAppMessage'
				]
			});
		}else{
			console.log(json.errmsg);
		}
	})
	var exports = {};
	exports.setWxShare = function(data){
		var title = data.title || '',
			desc = data.desc || '',
			link = data.link || '',
			imgUrl = data.imgUrl || '',
			trigger = data.trigger || function(res){console.log('share')},
			success = data.success || function(res){console.log('success')},
			cancel = data.cancel || function(res){console.log('cancel')};
			
		wx.ready(function () {
			wx.onMenuShareAppMessage({
				title: title,
				desc: desc,
				link: link,
				imgUrl: imgUrl,
				trigger: trigger,
				success: success,
				cancel: cancel,
				fail: function (res) {
					alert(JSON.stringify(res));
				}
			});
			wx.onMenuShareTimeline({
				title: title,
				link: link,
				imgUrl: imgUrl,
				trigger: trigger,
				success: success,
				cancel: cancel,
				fail: function (res) {
					alert(JSON.stringify(res));
				}
			});
		})
	}
	
	return exports;
})