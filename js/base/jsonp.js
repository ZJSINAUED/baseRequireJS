define(function(){
	function jsonpRequest(url, data, callback, charset){
		var script = document.createElement("script"),
		head = document.getElementsByTagName("head")[0] || document.documentElement,
		jsc = new Date().getTime(),
		randnum = Math.round(Math.random() * 1000),
		jsonp = ("jsonp" + randnum + jsc++);
		if (!callback) {
			callback = data;
			data = {};
		}
		if (typeof callback == 'function') {
			window[jsonp] = callback;
			callback = jsonp;
		}
		if (typeof data === "object") {
			data = paramArr(data);
		}
		script.src = url + (url.indexOf("?") !== -1 ? "&": "?") + "callback=" + callback + "&" + data;
		if (charset) {
			script.charset = charset;
		}
		var done = false;
		if (!done) {
			script.onload = script.onreadystatechange = function() {
				if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
					done = true;
					script.onload = script.onreadystatechange = null;
					head.removeChild(script);
					window[jsonp] = undefined;
					try {
						delete window[jsonp];
					} catch(jsonpError) {}
				}
			};
		}
		head.insertBefore(script, head.firstChild);
		return callback;
	}
	function paramArr(obj){
		var arr = [];
		for (var key in obj){
			arr.push(key+'='+encodeURIComponent(obj[key]));
		}
		return arr.join('&');
	}
	return jsonpRequest;
})