define(function(){
	var exports = {};
	exports.loadImage = function (url, callback) {
		var img = new Image();
		img.src = url;
		if (img.complete) {
			callback.call(img);
			return img;
		};
		img.onload = function () {
			callback.call(img);
		};
		img.onerror = function (){
			callback.call(img);
			console.log('load fail:'+url);
		};
		return img;
	};
	
	exports.loadImageArr = function (srcs, callback) {
		var srcs = srcs || [];
		var len = srcs.length;
		if (len < 1) return;
		//记录加载长度
		var loadNum = 0,loading_p = 0,imgElements = [];
		var loading = function(){
			if (loadNum < len){
				loading_p = Math.ceil(100 * loadNum / len);
				callback && callback(loading_p);
			}else{
				loading_p = '100';
				callback && callback(loading_p,imgElements);
			}
		}
		for (var i=0;i<len;i++){
			var _src = srcs[i];
			imgElements.push(exports.loadImage(_src, function (img) {
				loadNum++;
				loading();
			}))
		}
	};
	
	return exports;
})