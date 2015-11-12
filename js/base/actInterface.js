define(['jsonp'],function(jsonp){
	var exports = {},
		setLoading = false,  //标识载入样式结构是否创建
		flagQueue = [],  //请求标识队列
		loadingElement,  //载入样式结构
		lockFlag = true;  //限制同接口同ID不能同时请求
		
	function showLoading(params){
		params = params || {};
		if (typeof params.show == "undefined" ||  (typeof params.show != "undefined" && !!params.show == true)){
			if (!setLoading){
				createLoading(params.text || 'loading...');
			}
			loadingElement.style.display = 'block';
		}
	}
	function createLoading(text,html){
		if (setLoading){
			loadingElement.getElementsByTagName('em')[0].innerHTML = text;
			return;
		}
		loadingElement = document.createElement('div');
		loadingElement.innerHTML = html || '<span style="background:rgba(0,0,0,0.7);padding:5px;border-radius:5px;display:inline-block;font-size:28px;color:#fff;vertical-align:middle;position: absolute;top: 40%;left:50%;transform: translateX(-50%);-webkit-transform: translateX(-50%);margin-top:-50px;"><img style="margin:0 5px 0 10px;" src="http://zj.sinaimg.cn/zj_2014/nb_onepage/loading.gif" width="32"><em style="margin-right:15px;">'+text+' </em></span>';
		loadingElement.style.width = "100%";
		loadingElement.style.height = "100%";
		loadingElement.style.display = "none";
		loadingElement.style.zIndex = "999";
		loadingElement.style.left = "0px";
		loadingElement.style.top = "0px";
		document.body.appendChild(loadingElement);
		setLoading = true;
	}
	
	function setPostFlag(value){
		flagQueue.push(value);
		console.log(flagQueue);
	}
	
	function searchQueue(value){
		for (var i=0,len = flagQueue.length;i<len;i += 1){
			if (flagQueue[i] == value){
				return i;
			}
		}
		return false;
	}
	
	function resetFlag(value){
		var index = searchQueue(value);
		if (index !== false){
			flagQueue.splice(index,1);
		}
		
		if (setLoading && flagQueue.length == 0){  //载入队列清空后隐藏loading
			loadingElement.style.display = 'none';
		}
	}
	
	function postRequest(uniqueID,url,data,cb,params){
		if (searchQueue(uniqueID) !== false && lockFlag){
			return;
		}
		showLoading(params);
		setPostFlag(uniqueID);
		jsonp(url,data,function(json) {
			resetFlag(uniqueID);
			cb && cb(json);
		})
	}
	exports.changeLockFlag = function(value){
		lockFlag = Boolean(value);
	}
	exports.getOneWork = function(workid,cb,params){
		postRequest("w-"+workid,"http://act.city.sina.com.cn/interface/activity/json_get_one_user_work.php",{work_id:workid},cb,params);
	}
	
	exports.getRecordList = function(data,cb,params){
		postRequest("l-"+data.act_id,"http://act.city.sina.com.cn/interface/activity/json_get_user_works.php",data,cb,params);
	}
	
	exports.recordInfo = function(data,cb,params){
		postRequest("i-"+data.act_id,"http://act.city.sina.com.cn/interface/activity/json_add_signup.php",data,cb,params);
	}
	
	exports.checkInfo = function(data,cb,params){
		postRequest("c-"+data.act_id,"http://act.city.sina.com.cn/interface/activity/json_get_field_data.php",data,cb,params);
	}
	
	return exports;
})