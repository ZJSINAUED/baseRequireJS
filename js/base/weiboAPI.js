define(['sinaSSOController','jsonp'],function(sinaSSOController,jsonp){
	var exports = {},
		apiRootCokkieAuth = 'http://mblogv2.city.sina.com.cn/interface/tcommonv2/cookie_auth/',
		apiRootNoAuth = 'http://mblogv2.city.sina.com.cn/interface/tcommonv2/no_auth/',
		appId = 151,
		siteId = 908,
		token = '',
		currentUserInfo = null;
	//弹出信息
	function showMessage(message){
		alert(message);  //暂时使用默认弹框
	}
	//获取token
	function getToken(callback) {
		var url = apiRootCokkieAuth + 'postaction/get_token.php';
		if (token == '') {
			//console.log('getToken', 'refresh token');
			jsonp(url,{
					site_id : siteId,
					app_id : appId,
					t : 'jsonp'
				},function(rsp) {
					token = rsp.token;
					if (typeof(callback) == 'function') {
						callback();
					}
				});
		} else {
			//console.log('getToken', 'use cache');
			if (typeof(callback) == 'function') {
				callback();
			}
		}
	}
	//检查登录
	function checkLogin() {
		var userCookie = sinaSSOManager.getSinaCookie();
		if (!userCookie) {
			return false;
		} else {
			return true;
		}
	}
	//默认回调
	function defaultCallback(data, fn) {
		if (typeof(fn) == 'function') {
			fn(data);
		}else{
			if (data.error === '0') {
				showMessage("分享成功！");
			}else{
				showMessage(data.errmsg);
			}
		}
	}
	function postRequest(url,callback,data){
		if (!checkLogin()) {
			return;
		}
		getToken(function() {
			data = data || {};
			data.token = token;
			data.site_id = siteId;
			data.app_id = appId;
			jsonp(url,data,function(rsp) {
				defaultCallback(rsp, callback);
			});
		});
	}
	exports.checkLogin = checkLogin;
	exports.postWeibo = function(content, pid, callback) {
		if (content == '') {
			showMessage('请输入内容');
			return;
		}
		var url = apiRootCokkieAuth + 'postaction/json_add_mblog.php';
		postRequest(url,callback,{
			content : content,
			pid : pid || ""
		});
	}
	//带图片链接发微博
	exports.postWeiboByPic = function(content, pic_url, callback) {
		if (content == '') {
			self.showMessage('请输入内容');
			return;
		}
		var url = apiRootCokkieAuth + 'postaction/json_add_mblog.php';
		postRequest(url,callback,{
			content : content,
			pic_url : pic_url || ""
		});
	}
	//转发微博
	exports.repostWeibo = function(mid, content, isComment, callback) {
		if (content == '') {
			showMessage('请输入内容');
			return;
		}
		var url = apiRootCokkieAuth + 'postaction/json_repost_mblog.php';
		postRequest(url,callback,{
			status : content,
			mid : mid,
			is_comment : isComment ? isComment : 0  //是否在转发的同时发表评论。0表示不发表评论，1表示发表评论给当前微博，2表示发表评论给原微博，3是1、2都发表。默认为0。
		});
	}
	return exports;
})
