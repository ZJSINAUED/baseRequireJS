/**
 * animation
 * 动画执行
 * @params {dom} - dom dom节点 
 *         {object} - props 元素动画位置 
 *         {number} - speed 动画执行时间 
 *         {string} - easing 动画函数 {function} - easing 执行回调 
 *         {function} - callback 执行回调
 * @interface 
 * start 动画开始执行
 * stop 动画停止执行
 * reverse 动画反向播放
 **/

define(['baseTools'],function(baseTools){

console.log(baseTools);
var animation = function(dom,props,speed,callback,tween){
	this.dom = dom;
	this.props = props;
	this.speed = speed || 1000;
	
	if (typeof callback == "function"){
		this.callback = callback;
	}
	
	this.tween = tween ||  function(t, b, c, d) {
		return t * c / d + b;
	};
	
	this.fps = 36;
	this.timer = undefined;
	this.frames = Math.ceil(this.speed * this.fps/1000);
	this.initstate = {};
	for (var prop in this.props) {
		this.initstate[prop] = {
			from: parseFloat(baseTools.getStyle(this.dom, prop)),
			to: parseFloat(this.props[prop])
		};
	}
}

var pt = animation.prototype;
pt.start = function(){
	this.currentFrame = 0;
	this.__nextFrame();
}
pt.reverse = function(){
	this.stop();
	this.__prevFrame();
}
pt.__prevFrame = function(){
	var that = this;
	this.timer = setTimeout(function(){
		that.__prevFrame();
		that.currentFrame--;
		console.log(that.currentFrame);
		if (that.currentFrame <= 0){
			that.stop();
			that.currentFrame = 0;
		}
		that.__enterFrame.call(that);
	},1000/this.fps)
}
pt.stop = function(){
	if (this.timer) {
		clearTimeout(this.timer);
		this.timer = undefined;
	}
	this.currentFrame = this.frames;
	this.__enterFrame();
	this.callback && this.callback();
}
pt.__nextFrame = function(){
	var that = this;
	this.timer = setTimeout(function(){
		that.__nextFrame();
		that.currentFrame++;
		that.__enterFrame.call(that);
		
		if (that.currentFrame >= that.frames){
			that.stop();
			that.currentFrame = that.frames;
		}
	},1000/this.fps)
}
pt.__enterFrame = function(){
	for (var prop in this.initstate) {
		baseTools.setStyle(this.dom, prop,this.tween(this.currentFrame, this.initstate[prop]['from'], this.initstate[prop]['to'] - this.initstate[prop]['from'], this.frames).toFixed(2));
	}
}

return animation;
}) 