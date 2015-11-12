/**
 * baseTools.js
 * 提供原生JS选择器支持
 **/
define(function(){
var exports = {};
/**
 * getElementsByClass
 * 根据类名获取DOM节点
 * @params {dom} node元素结点 {string} classname类名
 * @return {array} DOM数组
 **/
exports.getElementsByClass = function(node,classname){
	if (node.getElementsByClassName) {
		return node.getElementsByClassName(classname);  //高级浏览器可以直接支持getElementsByClassName
	} else {
		return (function getElementsByClass(searchClass,node) {
			if ( node == null ) node = document;
			
			var classElements = [],
			els = node.getElementsByTagName("*"),
			elsLen = els.length,
			pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)"), i, j;

			for (i = 0, j = 0; i < elsLen; i++) {
				if ( pattern.test(els[i].className) ) {
					classElements[j] = els[i];
					j++;
				}
			}
			return classElements;
		})(classname, node);
	}
}
/**
 * 类名相关操作
 * hasClass：判断是否存在该项类名
 * addClass：增加类名
 * removeClass：删除类名
 * @params {dom}obj 节点元素 {string}cls 进行操作的类名
 **/
exports.hasClass = function(obj, cls) { 
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
}  
exports.addClass = function(obj, cls) {
    if (!this.hasClass(obj, cls)) obj.className += " " + cls;  
}
exports.removeClass = function(obj, cls) {
    if (this.hasClass(obj, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, ' ');
    }
}
/**
 * 客户端检测
 * @return {object} 
 * {}
 **/
exports.isMobile = function(){
	var ua = navigator.userAgent,
		isAndroid = ua.match(/Android/i) ? true : false,
		isBlackBerry = ua.match(/BlackBerry/i) ? true : false,
		isiOS = ua.match(/iPhone|ipad|iPod/i) ? true : false,
		isWindows = ua.match(/IEMobile/i) ? true : false;
	
	return {
		Android : isAndroid,
		BlackBerry : isBlackBerry,
		iOS : isiOS,
		Windows : isWindows,
		any : (isAndroid || isBlackBerry || isiOS || isWindows)
	}
}();
/**
 * getStyle
 * 获取CSS样式
 * @params {dom}dom - 元素结点 {string}prop - css属性
 **/
exports.getStyle = function(dom, prop) {
	var style = dom.currentStyle || window.getComputedStyle(dom, '');
	if (dom.style.filter) {
		return dom.style.filter.match(/\d+/g)[0];
	}
	return style[prop];
}
/**
 * setStyle
 * 改变CSS样式
 * @params {dom} dom - 元素结点 {string} prop - 结点css属性名 {string} - val 属性对应值 
 * @params {dom} dom - 元素结点 {object} prop - 需要改变属性对象 
 **/
exports.setStyle = function(dom, props, val){
	if (typeof props == "string" && typeof val != "undefined"){
		var prop = props;
		props = {};
		props[prop] = val;
	}
	for (var prop in props) {
		switch (prop) {
		case 'opacity':
			if(!!exports.isMobile.any && /MSIE ([^;]+)/.test(navigator.userAgent)){
				dom.style.filter = 'alpha(' + prop + '=' + props[prop] + ')'        
			}else{
				dom.style[prop] = props[prop];
			}
			break;
		default:
			dom.style[prop] = props[prop] + 'px';
			break;
		}
	}
}

//页面高度
exports.getbodyCH = function(){
	var bh=document.body.clientHeight,
		eh=document.documentElement.clientHeight;
	return bh > eh ? bh : eh;
}
//屏幕高度
exports.showbodyCH = function(){
	if(window.innerHeight){
		return window.innerHeight;
	}else if(document.documentElement && document.documentElement.clientHeight){
		return document.documentElement.clientHeight;
	}else if(document.body){
		return document.body.clientHeight;
	}
}
//屏幕宽度
exports.getbodyCW = function(){
	var bw=document.body.clientWidth,
		ew=document.documentElement.clientWidth;
	return bw > ew ? bw : ew;
}
//滚动条高度
exports.scrolltop = function(){
	if(window.pageYOffset){
		return window.pageYOffset;
	}else if(document.documentElement && document.documentElement.scrollTop){
		return document.documentElement.scrollTop;
	}else if(document.body){
		return document.body.scrollTop;
	}
}
/**
 * 事件绑定操作event对象
 * bind：绑定事件
 * unbind：解除绑定
 * cancelBubble：阻止事件冒泡
 * stopDefault：阻止浏览器默认行为
 **/
exports.event = {
	bind : function(element, eventType, handler, capture) {
        if (typeof element == "string") {
            element = document.getElementById(element);
        }
        if (typeof capture != "Boolean") {
            capture = false;
        }

        if (element.addEventListener) {
            element.addEventListener(eventType, handler, capture);
        }
        else if (element.attachEvent) {
            if (capture) {
                element.setCapture();
            }
            element.attachEvent("on" + eventType, handler);
        }
        else {
            element["on" + eventType] = handler;
        }
    },
	unbind : function(element, eventType, handler, releaseCapture) {
        if (typeof element == "string") {
            element = document.getElementById(element);
        }

        if (typeof releaseCapture != "Boolean") {
            releaseCapture = false;
        }

        if (element.removeEventListener) {
            element.removeEventListener(eventType, handler, releaseCapture);
        }else if (element.detachEvent) {
            if (releaseCapture) {
                element.releaseCapture();
            }

            element.detachEvent("on" + eventType, handler);
        }else {
            element["on" + eventType] = null;
        }
    },
	cancelBubble : function(e) {  //冒泡处理
        e = e || window.event;

        if (e.stopPropagation) {
            e.stopPropagation();
        }else {
            e.cancelBubble = true; //IE
        }
    },
	stopDefault : function(e){
		//阻止默认浏览器动作(W3C) 
		if ( e && e.preventDefault ) {
			e.preventDefault(); 
		}else{//IE中阻止函数器默认动作的方式
			window.event.returnValue = false; 
		}
		return false; 
	}
}
return exports;
})